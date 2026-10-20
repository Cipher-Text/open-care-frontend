"use client";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
						<AdminTopbar />
						{children}
					</main>
				</div>
			</SidebarProvider>
		</>
	);
}
