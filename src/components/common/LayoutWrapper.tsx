"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const pathname = usePathname();

	// The console (/admin), the account area (/account) and the auth pages have their own chrome
	const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/account");
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
			<main id="main-content">{children}</main>
			<Footer />
		</>
	);
}
