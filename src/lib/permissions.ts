type JwtPayload = {
  permissions?: unknown;
  authorities?: unknown;
  scope?: unknown;
  roles?: unknown;
  groups?: unknown;
  realm_access?: {
    roles?: unknown;
  };
  resource_access?: Record<string, { roles?: unknown }>;
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "super-admin": [
    "view_super_admin_panel",
    "view_admin_panel",
    "view_moderator_panel",
    "view_operator_panel",
    "view_doctor_panel",
    "view_hospital_admin_panel",
    "view_social_organization_admin_panel",
    "view_institution_admin_panel",
    "create-doctor",
    "update-doctor",
    "delete-doctor",
    "create-doctor-user",
    "create-nurse",
    "update-nurse",
    "delete-nurse",
    "create-profile",
    "update-profile",
    "delete-profile",
    "create-hospital",
    "update-hospital",
    "delete-hospital",
    "create-social-organization",
    "update-social-organization",
    "delete-social-organization",
    "create-institution",
    "update-institution",
    "delete-institution",
    "create-master-data",
    "update-master-data",
    "delete-master-data",
    "create-hospital-medical-test",
    "update-hospital-medical-test",
    "delete-hospital-medical-test",
    "create-ambulance",
    "update-ambulance",
    "delete-ambulance",
    "create-hospital-amenity",
    "update-hospital-amenity",
    "delete-hospital-amenity",
    "assign-user-role",
    "remove-user-role",
    "sync-data",
  ],
  admin: [
    "view_admin_panel",
    "view_moderator_panel",
    "view_operator_panel",
    "view_doctor_panel",
    "view_hospital_admin_panel",
    "view_social_organization_admin_panel",
    "view_institution_admin_panel",
    "create-doctor",
    "update-doctor",
    "delete-doctor",
    "create-doctor-user",
    "create-nurse",
    "update-nurse",
    "delete-nurse",
    "create-profile",
    "update-profile",
    "delete-profile",
    "create-hospital",
    "update-hospital",
    "delete-hospital",
    "create-social-organization",
    "update-social-organization",
    "delete-social-organization",
    "create-institution",
    "update-institution",
    "delete-institution",
    "create-master-data",
    "update-master-data",
    "delete-master-data",
    "create-hospital-medical-test",
    "update-hospital-medical-test",
    "delete-hospital-medical-test",
    "create-ambulance",
    "update-ambulance",
    "delete-ambulance",
    "create-hospital-amenity",
    "update-hospital-amenity",
    "delete-hospital-amenity",
    "assign-user-role",
    "remove-user-role",
  ],
  moderator: [
    "view_moderator_panel",
    "view_doctor_panel",
    "create-doctor",
    "update-doctor",
    "create-profile",
    "update-profile",
    "create-hospital",
    "update-hospital",
    "create-social-organization",
    "update-social-organization",
    "create-institution",
    "update-institution",
    "create-master-data",
    "update-master-data",
    "create-hospital-medical-test",
    "update-hospital-medical-test",
    "create-ambulance",
    "update-ambulance",
    "create-hospital-amenity",
    "update-hospital-amenity",
  ],
  operator: [
    "view_operator_panel",
    "create-doctor",
    "create-profile",
    "update-profile",
    "create-hospital",
    "create-hospital-medical-test",
    "create-ambulance",
    "create-hospital-amenity",
  ],
  "hospital-admin": [
    "view_hospital_admin_panel",
    "create-doctor",
    "update-doctor",
    "create-doctor-user",
    "create-nurse",
    "update-nurse",
    "delete-nurse",
    "update-hospital",
    "create-hospital-medical-test",
    "update-hospital-medical-test",
    "delete-hospital-medical-test",
    "create-ambulance",
    "update-ambulance",
    "delete-ambulance",
    "create-hospital-amenity",
    "update-hospital-amenity",
    "delete-hospital-amenity",
  ],
  "hospital-user": ["view_hospital_admin_panel"],
  "institution-admin": ["view_institution_admin_panel", "update-institution"],
  "institution-user": ["view_institution_admin_panel"],
  "social-organization-admin": [
    "view_social_organization_admin_panel",
    "update-social-organization",
  ],
  "social-organization-user": ["view_social_organization_admin_panel"],
  doctor: ["view_doctor_panel", "update-profile", "update-doctor"],
  nurse: ["view_doctor_panel", "update-profile", "update-nurse"],
};

const tokenPartPattern = /_/g;

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(tokenPartPattern, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  return atob(padded);
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const normalizeRole = (role: string) =>
  role.split("/").filter(Boolean).pop()?.toLowerCase() || "";

const collectStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];

const addPermissionVariant = (set: Set<string>, permission: string) => {
  const trimmed = permission.trim();
  if (!trimmed) return;
  set.add(trimmed);
  set.add(trimmed.replace(/_/g, "-"));
  set.add(trimmed.replace(/-/g, "_"));
};

const extractRoles = (payload: JwtPayload | null) => {
  if (!payload) return [];

  const roles = new Set<string>();

  collectStringArray(payload.roles).forEach((role) => roles.add(role));
  collectStringArray(payload.groups).forEach((role) => roles.add(role));
  collectStringArray(payload.realm_access?.roles).forEach((role) =>
    roles.add(role)
  );

  if (payload.resource_access && typeof payload.resource_access === "object") {
    Object.values(payload.resource_access).forEach((resource) => {
      collectStringArray(resource?.roles).forEach((role) => roles.add(role));
    });
  }

  return Array.from(roles);
};

const extractPermissionsFromClaim = (claim: unknown) => {
  const permissions = new Set<string>();

  if (Array.isArray(claim)) {
    claim.forEach((entry) => {
      if (typeof entry === "string") {
        addPermissionVariant(permissions, entry);
        return;
      }

      if (entry && typeof entry === "object") {
        const typedEntry = entry as { scopes?: unknown; name?: unknown };
        collectStringArray(typedEntry.scopes).forEach((scope) =>
          addPermissionVariant(permissions, scope)
        );
        if (typeof typedEntry.name === "string") {
          addPermissionVariant(permissions, typedEntry.name);
        }
      }
    });
  }

  return Array.from(permissions);
};

export const getPermissionsFromToken = (token?: string | null) => {
  if (typeof window === "undefined" || !token) return [];

  const payload = decodeJwtPayload(token);
  if (!payload) return [];

  const permissions = new Set<string>();

  extractPermissionsFromClaim(payload.permissions).forEach((permission) =>
    addPermissionVariant(permissions, permission)
  );
  extractPermissionsFromClaim(payload.authorities).forEach((permission) =>
    addPermissionVariant(permissions, permission)
  );

  if (typeof payload.scope === "string") {
    payload.scope
      .split(" ")
      .map((scope) => scope.trim())
      .filter(Boolean)
      .forEach((scope) => addPermissionVariant(permissions, scope));
  }

  extractRoles(payload).forEach((role) => {
    const normalizedRole = normalizeRole(role);
    addPermissionVariant(permissions, normalizedRole);
    const rolePermissions = ROLE_PERMISSIONS[normalizedRole];
    rolePermissions?.forEach((permission) =>
      addPermissionVariant(permissions, permission)
    );
  });

  return Array.from(permissions);
};

export const hasPermission = (
  permission: string,
  permissions: string[]
) => {
  return permissions.includes(permission);
};
