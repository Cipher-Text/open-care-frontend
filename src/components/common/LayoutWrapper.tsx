"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const pathname = usePathname();

	// Check if the current path is an admin route
	const isAdminRoute = pathname?.startsWith("/admin");

	// If it's an admin route, don't show header and footer
	if (isAdminRoute) {
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
