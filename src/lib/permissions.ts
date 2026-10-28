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
  });

  return Array.from(permissions);
};

export const hasPermission = (
  permission: string,
  permissions: string[]
) => {
  return permissions.includes(permission);
};
