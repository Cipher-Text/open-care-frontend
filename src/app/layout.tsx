import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Hind_Siliguri, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { LayoutWrapper } from "@/components/common/LayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ClientProviders } from "@/components/common/ClientProviders";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

// Headings
const jakarta = Plus_Jakarta_Sans({
	variable: "--font-display-latin",
	subsets: ["latin"],
	display: "swap",
});

// Bengali glyphs for Bangla names and future Bangla UI copy
const hindSiliguri = Hind_Siliguri({
	variable: "--font-bengali",
	subsets: ["bengali"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Open Care - Find doctors and hospitals in Bangladesh",
	description:
		"Search a directory of doctors and hospitals across Bangladesh by specialty, location and type.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${jakarta.variable} ${hindSiliguri.variable} ${geistMono.variable} antialiased`}
			>
				<ClientProviders>
					<GoogleAnalytics />
					<LayoutWrapper>{children}</LayoutWrapper>
					<Toaster />
				</ClientProviders>
			</body>
		</html>
	);
}
