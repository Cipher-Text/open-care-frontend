"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SidebarProvider } from "@/components/ui/sidebar";
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
	return (
		<>
			<SidebarProvider>
				<div className="flex min-h-screen w-full">
					<AdminSidebar />
					<main className="flex-1 overflow-hidden">
						<div className="print:hidden">
							<AdminTopbar />
						</div>
						<RouteGuard>{children}</RouteGuard>
					</main>
				</div>
			</SidebarProvider>
		</>
	);
}
