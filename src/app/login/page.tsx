"use client";

import { useActionState, useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, Zap } from "lucide-react";
import { loginSchema, LoginFormData } from "@/validations/login-schema";
import { devLogin, getDevLoginAccounts, submitLogin } from "./actions";
import { redirectAfterLogin } from "./redirect-actions";
import { saveUserSession } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formState, action, isFormLoading] = useActionState(submitLogin, {
		success: false,
	});
	const [devState, devAction, isDevLoading] = useActionState(devLogin, {
		success: false,
	});
	// Whichever login path ran last drives the UI
	const state = devState.success || devState.error ? devState : formState;
	const isLoading = isFormLoading || isDevLoading;
	const isDev = process.env.NODE_ENV === "development";
	const [devAccounts, setDevAccounts] = useState<
		{ label: string; username: string }[]
	>([]);

	useEffect(() => {
		if (isDev) getDevLoginAccounts().then(setDevAccounts);
	}, [isDev]);

	// Set by the signup page after a successful registration
	const [justRegistered, setJustRegistered] = useState(false);
	useEffect(() => {
		setJustRegistered(new URLSearchParams(window.location.search).get("registered") === "1");
	}, []);
	// const { refetchUser } = useAuth();

	// Handle redirect on successful login
	useEffect(() => {
		if (state.success && state.data) {
			// Save session to localStorage for client-side access
			saveUserSession(state.data);

			// Refetch user in auth context
			// refetchUser();

			if (state.shouldRedirect) {
				// Use server action for redirect to ensure proper server-side redirect
				redirectAfterLogin();
			}
		}
	}, [state.success, state.shouldRedirect, state.data]);

	const {
		register,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	return (
		<div className="min-h-screen bg-muted/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Welcome Back
					</h1>
					<p className="text-muted-foreground">Sign in to your OpenCare account</p>
				</div>

				{/* Login Form */}
				<Card className="border border-border shadow-lg">
					<CardHeader className="space-y-1 pb-6">
						<CardTitle className="text-2xl font-bold text-center text-primary">
							Sign In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={action} className="space-y-6">
							{justRegistered && (
								<div role="status" className="bg-success/10 border border-success/30 rounded-md p-3">
									<p className="text-sm text-success">
										Your account was created. Sign in with your email and password.
									</p>
								</div>
							)}

							{/* Server Error Display */}
							{state.error && (
								<div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
									<p className="text-sm text-destructive">{state.error}</p>
								</div>
							)}

							{/* Success Message */}
							{state.success && (
								<div className="bg-success/10 border border-success/30 rounded-md p-3">
									<p className="text-sm text-success">Login successful!</p>
								</div>
							)}

							{/* Username Field */}
							<div className="space-y-2">
								<Label
									htmlFor="username"
									className="text-sm font-medium text-muted-foreground"
								>
									Username
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
									<Input
										id="username"
										type="text"
										placeholder="Enter your username"
										className={`pl-10 h-12 border-input focus:border-primary focus:ring-primary ${
											errors.username
												? "border-destructive focus:border-destructive"
												: ""
										}`}
										{...register("username")}
									/>
								</div>
								{errors.username && (
									<p className="text-sm text-destructive">
										{errors.username.message}
									</p>
								)}
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium text-muted-foreground"
								>
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										className={`pl-10 pr-12 h-12 border-input focus:border-primary focus:ring-primary ${
											errors.password
												? "border-destructive focus:border-destructive"
												: ""
										}`}
										{...register("password")}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										aria-label={showPassword ? "Hide password" : "Show password"}
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</Button>
								</div>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<Checkbox id="remember-me" name="remember-me" />
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-muted-foreground"
									>
										Remember me
									</label>
								</div>
								<Link
									href="/forgot-password"
									className="text-sm text-primary hover:text-primary"
								>
									Forgot password?
								</Link>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
							>
								{isLoading ? "Signing In..." : "Sign In"}
							</Button>

							{/* Development only: removed from production builds */}
							{isDev && (
								<fieldset className="space-y-2 rounded-lg border border-dashed border-input p-3">
									<legend className="flex items-center gap-1 px-1 text-xs font-medium text-muted-foreground">
										<Zap className="size-3" aria-hidden="true" />
										Dev login, one click
									</legend>
									{devAccounts.length === 0 ? (
										<p className="text-xs text-muted-foreground">
											Set DEV_LOGIN_ACCOUNTS in .env.local and restart the dev server.
										</p>
									) : (
										<div className="grid grid-cols-2 gap-2">
											{devAccounts.map((account) => (
												<Button
													key={account.username}
													type="button"
													onClick={() =>
														startTransition(() => {
															const data = new FormData();
															data.set("account", account.username);
															devAction(data);
														})
													}
													variant="outline"
													disabled={isLoading}
													className="h-auto min-h-10 justify-start whitespace-normal py-2 text-left text-sm"
												>
													{account.label}
												</Button>
											))}
										</div>
									)}
								</fieldset>
							)}

							{/* Sign Up Link */}
							<div className="text-center">
								<p className="text-sm text-muted-foreground">
									Don&apos;t have an account?{" "}
									<Link
										href="/signup"
										className="text-primary hover:text-primary font-medium"
									>
										Sign up here
									</Link>
								</p>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
