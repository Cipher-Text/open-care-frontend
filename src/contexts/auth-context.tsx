"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { purgeLegacySession, clientLogout } from "@/lib/auth-client";
import { getSession, resetSession, type SessionInfo } from "@/lib/session-client";

interface AuthContextType {
	/** Who is signed in (no token: it stays in the httpOnly cookies), or null. */
	user: SessionInfo | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	logout: () => void;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<SessionInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const load = useCallback(async () => {
		const session = await getSession();
		setUser(session.signedIn ? session : null);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		purgeLegacySession();
		void load();
	}, [load]);

	const logout = () => {
		setUser(null);
		clientLogout();
	};

	const refetchUser = async () => {
		resetSession();
		await load();
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		logout,
		refetchUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
