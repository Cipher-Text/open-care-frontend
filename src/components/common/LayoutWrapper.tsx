"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const pathname = usePathname();

	// Check if the current path is an admin route or auth route
	const isAdminRoute = pathname?.startsWith("/admin");
	const isAuthRoute =
		pathname?.startsWith("/login") ||
		pathname?.startsWith("/signup") ||
		pathname?.startsWith("/auth");

	// If it's an admin or auth route, don't show header and footer
	if (isAdminRoute || isAuthRoute) {
		return <>{children}</>;
	}

	// For all other routes, show header and footer
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
