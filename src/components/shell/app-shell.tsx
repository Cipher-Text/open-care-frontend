"use client";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AppSidebar, type ShellGroup } from "@/components/shell/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * The frame of every signed-in page: the collapsible side menu, and the top bar with the workspace switcher, notifications and the
 * account menu. The console and the account area both render their pages inside it, so a nutritionist, a nurse, a doctor and a member of
 * staff see the same frame; only the menu and the heading differ.
 */
export function AppShell({
	brandTitle,
	brandSubtitle,
	groups,
	exact,
	notificationsHref,
	children,
}: {
	brandTitle: string;
	brandSubtitle: string;
	groups: ShellGroup[];
	exact?: string[];
	notificationsHref: string;
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar brandTitle={brandTitle} brandSubtitle={brandSubtitle} groups={groups} exact={exact} />
				<main className="flex-1 overflow-hidden">
					<div className="print:hidden">
						<AdminTopbar notificationsHref={notificationsHref} />
					</div>
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
}
