export interface RoleInfo {
	/** Keycloak group name that carries the role's permissions, used in API paths. */
	group: string;
	userType: string;
	name: string;
	banglaName: string;
}

export interface PermissionInfo {
	name: string;
	category: string;
	displayName: string;
	description: string | null;
}

export interface RolePermissionMatrix {
	roles: RoleInfo[];
	permissions: PermissionInfo[];
	/** group name -> permission names the role currently has */
	mapping: Record<string, string[]>;
}

export interface RolePermissionUpdateResult {
	group: string;
	added: string[];
	removed: string[];
	permissions: string[];
}

export interface RolePermissionAuditEntry {
	id: number;
	group: string;
	permission: string;
	action: "GRANT" | "REVOKE";
	changedBy: string;
	changedAt: string;
}
