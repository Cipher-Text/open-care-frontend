"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { registerUser } from "@/api/register";
import { fetchDistricts } from "@/api/locations";
import { fetchBloodGroups } from "@/api/blood-groups";
import { fetchGenders } from "@/api/gender";
import type { District } from "@/types/locations";
import type { BloodGroup } from "@/types/blood-groups";
import type { Gender } from "@/types/gender";

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
      await registerUser(data);
      router.push("/login?registered=1");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blood groups from API
  const {
    data: bloodGroups = [],
    isLoading: isLoadingBloodGroups,
    isError: isBloodGroupsError,
  } = useQuery<BloodGroup[]>({
    queryKey: ["bloodGroups"],
    queryFn: fetchBloodGroups,
  });

  // Fetch genders from API
  const {
    data: genders = [],
    isLoading: isLoadingGenders,
    isError: isGendersError,
  } = useQuery<Gender[]>({
    queryKey: ["genders"],
    queryFn: fetchGenders,
  });

  // Fetch districts from API
  const {
    data: districts = [],
    isLoading: isLoadingDistricts,
    isError: isDistrictsError,
  } = useQuery<District[]>({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
  });

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join OpenCare
          </h1>
          <p className="text-muted-foreground">
            Create your account to access healthcare services
          </p>
        </div>

        {/* Signup Form */}
        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-primary">
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
                    className="text-sm font-medium text-muted-foreground"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter first name"
                      className={`pl-10 h-12 border-input focus:border-primary focus:ring-primary ${
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
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter last name"
                      className={`pl-10 h-12 border-input focus:border-primary focus:ring-primary ${
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 h-12 border-input focus:border-primary focus:ring-primary ${
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`pl-10 h-12 border-input focus:border-primary focus:ring-primary ${
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`pl-10 pr-12 h-12 border-input focus:border-primary focus:ring-primary ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
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
                  <Label className="text-sm font-medium text-muted-foreground">
                    Blood Group
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("bloodGroup", value)}
                    disabled={isLoadingBloodGroups || isBloodGroupsError}
                  >
                    <SelectTrigger
                      className={`h-12 border-input focus:border-primary ${
                        errors.bloodGroup
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingBloodGroups
                            ? "Loading blood groups..."
                            : isBloodGroupsError
                            ? "Failed to load blood groups"
                            : "Select blood group"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group: BloodGroup) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.displayName} ({group.bnName})
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
                  <Label className="text-sm font-medium text-muted-foreground">
                    Gender
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("gender", value)}
                    disabled={isLoadingGenders || isGendersError}
                  >
                    <SelectTrigger
                      className={`h-12 border-input focus:border-primary ${
                        errors.gender
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingGenders
                            ? "Loading genders..."
                            : isGendersError
                            ? "Failed to load genders"
                            : "Select gender"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender: Gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.displayName} ({gender.banglaName})
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
                  <Label className="text-sm font-medium text-muted-foreground">
                    District
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("districtId", parseInt(value))
                    }
                    disabled={isLoadingDistricts || isDistrictsError}
                  >
                    <SelectTrigger
                      className={`h-12 border-input focus:border-primary ${
                        errors.districtId
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingDistricts
                            ? "Loading districts..."
                            : isDistrictsError
                            ? "Failed to load districts"
                            : "Select district"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district: District) => (
                        <SelectItem
                          key={district.id}
                          value={district.id.toString()}
                        >
                          {district.name} ({district.bnName})
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
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  isLoadingDistricts ||
                  isLoadingBloodGroups ||
                  isLoadingGenders
                }
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary font-medium"
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
