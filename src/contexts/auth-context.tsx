"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse } from "@/types/auth";
import { getUserSession, clearUserSession } from "@/lib/auth-client";

interface AuthContextType {
	user: LoginResponse | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	logout: () => void;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<LoginResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize user from session on mount
	useEffect(() => {
		const initializeUser = async () => {
			try {
				const session = getUserSession();
				setUser(session);
			} catch (error) {
				console.error("Failed to load user session:", error);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initializeUser();
	}, []);

	const logout = () => {
		clearUserSession();
		setUser(null);
	};

	const refetchUser = async () => {
		try {
			const session = getUserSession();
			setUser(session);
		} catch (error) {
			console.error("Failed to refetch user session:", error);
			setUser(null);
		}
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
