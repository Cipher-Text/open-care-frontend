import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign in | Open Care",
	description: "Sign in to your Open Care account.",
	// a form, not something to list in search results
	robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return children;
}
