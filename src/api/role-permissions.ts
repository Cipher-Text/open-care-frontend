import { apiGet, apiPut, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import { PageResult } from "@/types/common";
import {
	RolePermissionAuditEntry,
	RolePermissionMatrix,
	RolePermissionUpdateResult,
} from "@/types/role-permissions";

export const fetchRolePermissionMatrix = async (): Promise<RolePermissionMatrix> => {
	const response = await apiGet<RolePermissionMatrix>("/role-permissions");
	if (!response.ok) {
		throw new Error(response.error || "Failed to load roles and permissions");
	}
	return response.data as RolePermissionMatrix;
};

/** Makes `permissions` the complete permission set of the role. */
export const updateRolePermissions = async (
	group: string,
	permissions: string[]
): Promise<RolePermissionUpdateResult> => {
	const response = await apiPut<RolePermissionUpdateResult>(
		`/role-permissions/${encodeURIComponent(group)}`,
		{ permissions }
	);
	if (!response.ok) {
		throw new Error(response.error || `Failed to update ${group}`);
	}
	return response.data as RolePermissionUpdateResult;
};

/** Newest first. `page` is 1-based. */
export const fetchRolePermissionAudit = async (
	page: number,
	size = 20
): Promise<PageResult<RolePermissionAuditEntry>> => {
	const response = await apiGet<WirePage<RolePermissionAuditEntry>>(
		buildUrl("/role-permissions/audit", { page: toWirePage(page), size })
	);
	if (!response.ok) {
		throw new Error(response.error || "Failed to load history");
	}
	return normalizePage(response.data);
};
