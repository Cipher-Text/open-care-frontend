"use client";

import { AuthProvider } from "@/contexts/auth-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
	return <AuthProvider>{children}</AuthProvider>;
}
