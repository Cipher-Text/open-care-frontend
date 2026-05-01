"use client";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<div className="flex min-h-screen w-full">
					<AdminSidebar />
					<main className="flex-1 overflow-hidden">{children}</main>
				</div>
			</SidebarProvider>
		</QueryClientProvider>
	);
}
