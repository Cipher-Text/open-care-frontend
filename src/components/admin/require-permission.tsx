"use client";

import { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/use-permissions";

/**
 * Page guard: shows the page only to someone holding the permission, and renders nothing that fetches data
 * otherwise. This is for the experience; the API enforces the same permission on every route.
 */
export function RequirePermission({ permission, children }: { permission: string; children: ReactNode }) {
	const { hasPermission, ready } = usePermissions();
	if (!ready) return null;
	if (!hasPermission(permission)) {
		return (
			<div className="p-4 md:p-8">
				<Alert>
					<AlertDescription>You do not have access to this page.</AlertDescription>
				</Alert>
			</div>
		);
	}
	return <>{children}</>;
}
