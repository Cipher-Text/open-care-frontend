import { Inter, Plus_Jakarta_Sans, Hind_Siliguri, Geist_Mono } from "next/font/google";

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

// Bengali glyphs for Bangla names and Bangla page text
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

export const fontClassName = `${inter.variable} ${jakarta.variable} ${hindSiliguri.variable} ${geistMono.variable} antialiased`;
