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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { signupSchema, SignupFormData } from "@/validations/signup-schema";

export default function SignupPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupFormData) => {
		setIsLoading(true);
		setError("");

		try {
			// TODO: Replace with actual API call
			console.log("Signup data:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// TODO: Handle successful signup (redirect to login or dashboard)
			router.push("/login?message=Account created successfully");
		} catch {
			setError(
				"An error occurred while creating your account. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
	const genders = ["MALE", "FEMALE", "OTHER"];

	// Mock districts data - replace with actual API call
	const districts = [
		{ id: 1073741824, name: "Dhaka" },
		{ id: 1073741825, name: "Chittagong" },
		{ id: 1073741826, name: "Sylhet" },
		{ id: 1073741827, name: "Rajshahi" },
		{ id: 1073741828, name: "Barisal" },
		{ id: 1073741829, name: "Khulna" },
		{ id: 1073741830, name: "Rangpur" },
		{ id: 1073741831, name: "Mymensingh" },
	];

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Join OpenCare
					</h1>
					<p className="text-gray-600">
						Create your account to access healthcare services
					</p>
				</div>

				{/* Signup Form */}
				<Card className="border border-gray-200 shadow-lg">
					<CardHeader className="space-y-1 pb-6">
						<CardTitle className="text-2xl font-bold text-center text-teal-700">
							Create Account
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

							{/* Name Fields */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* First Name */}
								<div className="space-y-2">
									<Label
										htmlFor="firstName"
										className="text-sm font-medium text-gray-700"
									>
										First Name
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											id="firstName"
											type="text"
											placeholder="Enter first name"
											className={`pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
												errors.firstName
													? "border-red-500 focus:border-red-500"
													: ""
											}`}
											{...register("firstName")}
										/>
									</div>
									{errors.firstName && (
										<p className="text-sm text-red-600">
											{errors.firstName.message}
										</p>
									)}
								</div>

								{/* Last Name */}
								<div className="space-y-2">
									<Label
										htmlFor="lastName"
										className="text-sm font-medium text-gray-700"
									>
										Last Name
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											id="lastName"
											type="text"
											placeholder="Enter last name"
											className={`pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
												errors.lastName
													? "border-red-500 focus:border-red-500"
													: ""
											}`}
											{...register("lastName")}
										/>
									</div>
									{errors.lastName && (
										<p className="text-sm text-red-600">
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							{/* Email Field */}
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium text-gray-700"
								>
									Email Address
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										className={`pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
											errors.email ? "border-red-500 focus:border-red-500" : ""
										}`}
										{...register("email")}
									/>
								</div>
								{errors.email && (
									<p className="text-sm text-red-600">{errors.email.message}</p>
								)}
							</div>

							{/* Phone Field */}
							<div className="space-y-2">
								<Label
									htmlFor="phone"
									className="text-sm font-medium text-gray-700"
								>
									Phone Number
								</Label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="phone"
										type="tel"
										placeholder="Enter your phone number"
										className={`pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 ${
											errors.phone ? "border-red-500 focus:border-red-500" : ""
										}`}
										{...register("phone")}
									/>
								</div>
								{errors.phone && (
									<p className="text-sm text-red-600">{errors.phone.message}</p>
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
										placeholder="Create a strong password"
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

							{/* Personal Info Grid */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Blood Group */}
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">
										Blood Group
									</Label>
									<Select
										onValueChange={(value) => setValue("bloodGroup", value)}
									>
										<SelectTrigger
											className={`h-12 border-gray-300 focus:border-teal-500 ${
												errors.bloodGroup
													? "border-red-500 focus:border-red-500"
													: ""
											}`}
										>
											<SelectValue placeholder="Select blood group" />
										</SelectTrigger>
										<SelectContent>
											{bloodGroups.map((group) => (
												<SelectItem key={group} value={group}>
													{group}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.bloodGroup && (
										<p className="text-sm text-red-600">
											{errors.bloodGroup.message}
										</p>
									)}
								</div>

								{/* Gender */}
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">
										Gender
									</Label>
									<Select onValueChange={(value) => setValue("gender", value)}>
										<SelectTrigger
											className={`h-12 border-gray-300 focus:border-teal-500 ${
												errors.gender
													? "border-red-500 focus:border-red-500"
													: ""
											}`}
										>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											{genders.map((gender) => (
												<SelectItem key={gender} value={gender}>
													{gender}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.gender && (
										<p className="text-sm text-red-600">
											{errors.gender.message}
										</p>
									)}
								</div>

								{/* District */}
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">
										District
									</Label>
									<Select
										onValueChange={(value) =>
											setValue("districtId", parseInt(value))
										}
									>
										<SelectTrigger
											className={`h-12 border-gray-300 focus:border-teal-500 ${
												errors.districtId
													? "border-red-500 focus:border-red-500"
													: ""
											}`}
										>
											<SelectValue placeholder="Select district" />
										</SelectTrigger>
										<SelectContent>
											{districts.map((district) => (
												<SelectItem
													key={district.id}
													value={district.id.toString()}
												>
													{district.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.districtId && (
										<p className="text-sm text-red-600">
											{errors.districtId.message}
										</p>
									)}
								</div>
							</div>

							{/* Terms and Conditions */}
							<div className="flex items-center">
								<input
									id="terms"
									name="terms"
									type="checkbox"
									required
									className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="terms"
									className="ml-2 block text-sm text-gray-700"
								>
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-teal-600 hover:text-teal-500"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-teal-600 hover:text-teal-500"
									>
										Privacy Policy
									</Link>
								</label>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium"
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							{/* Login Link */}
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Already have an account?{" "}
									<Link
										href="/login"
										className="text-teal-600 hover:text-teal-500 font-medium"
									>
										Sign in here
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
