"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConsoleGroups } from "@/components/admin/admin-sidebar";
import { AppShell } from "@/components/shell/app-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { routeAllowed } from "@/config/navigation-rules";
import { usePermissions } from "@/hooks/use-permissions";

/**
 * Every console page is guarded here by its navigation rule, so a page cannot be opened by typing its
 * address when the menu hides it. Nothing is rendered (and so nothing is fetched) until access is known.
 */
function RouteGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { hasPermission, ready } = usePermissions();
	if (!ready) return null;
	if (!routeAllowed(pathname, hasPermission)) {
		return (
			<div className="p-4 md:p-8">
				<Alert>
					<AlertDescription>
						You do not have access to this page.{" "}
						<Link href="/admin" className="underline">
							Back to the dashboard
						</Link>
						.
					</AlertDescription>
				</Alert>
			</div>
		);
	}
	return <>{children}</>;
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const groups = useConsoleGroups();
	return (
		<AppShell brandTitle="OpenCare Admin" brandSubtitle="Healthcare Management" groups={groups} exact={["/admin"]} notificationsHref="/admin/notifications">
			<RouteGuard>{children}</RouteGuard>
		</AppShell>
	);
}
