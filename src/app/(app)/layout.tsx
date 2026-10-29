import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ClientProviders } from "@/components/common/ClientProviders";
import { fontClassName } from "@/lib/fonts";

export const metadata: Metadata = {
	title: "Open Care - Find doctors and hospitals in Bangladesh",
	description: "Search a directory of doctors and hospitals across Bangladesh by specialty, location and type.",
};

/** Root layout of the sign-in, account and console routes: English only, with their own page chrome. */
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={fontClassName}>
				<ClientProviders>
					<GoogleAnalytics />
					{children}
					<Toaster />
				</ClientProviders>
			</body>
		</html>
	);
}
