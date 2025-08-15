"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { loginSchema, LoginFormData } from "@/validations/login-schema";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		setError("");

		try {
			// TODO: Replace with actual API call
			console.log("Login data:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// TODO: Handle successful login (store tokens, redirect, etc.)
			router.push("/");
		} catch {
			setError("Invalid username or password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600">Sign in to your OpenCare account</p>
				</div>

				{/* Login Form */}
				<Card className="border border-gray-200 shadow-lg">
					<CardHeader className="space-y-1 pb-6">
						<CardTitle className="text-2xl font-bold text-center text-teal-700">
							Sign In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{error && (
								<Alert className="border-red-200 bg-red-50">
									<AlertDescription className="text-red-700">
										{error}
									</AlertDescription>
								</Alert>
							)}

							{/* Username Field */}
							<div className="space-y-2">
								<Label
									htmlFor="username"
									className="text-sm font-medium text-gray-700"
								>
									Username
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="username"
										type="text"
										placeholder="Enter your username"
										className={`pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
											errors.username
												? "border-red-500 focus:border-red-500"
												: ""
										}`}
										{...register("username")}
									/>
								</div>
								{errors.username && (
									<p className="text-sm text-red-600">
										{errors.username.message}
									</p>
								)}
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium text-gray-700"
								>
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										className={`pl-10 pr-12 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
											errors.password
												? "border-red-500 focus:border-red-500"
												: ""
										}`}
										{...register("password")}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-gray-700"
									>
										Remember me
									</label>
								</div>
								<Link
									href="/forgot-password"
									className="text-sm text-teal-600 hover:text-teal-500"
								>
									Forgot password?
								</Link>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium"
							>
								{isLoading ? "Signing In..." : "Sign In"}
							</Button>

							{/* Sign Up Link */}
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Don&apos;t have an account?{" "}
									<Link
										href="/signup"
										className="text-teal-600 hover:text-teal-500 font-medium"
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
