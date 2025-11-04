"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AdminHeader } from "@/components/admin/admin-header";

import {
	addDoctorSchema,
	AddDoctorFormData,
} from "@/validations/add-doctor-schema";
import { addDoctor, fetchDoctorById, updateDoctor } from "@/api/doctors";
import {
	fetchDistricts,
	fetchUpazilas,
	fetchUnionsByUpazila,
} from "@/api/locations";
import { Doctor } from "@/types/doctors";
import { District, Upazila, Union } from "@/types/locations";

export default function DoctorFormPage() {
	const router = useRouter();
	const params = useParams();
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
		null
	);
	const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(
		null
	);

	const doctorId = params.id === "new" ? null : (params.id as string);
	const isEditing = doctorId !== null;

	// Fetch districts
	const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
		queryKey: ["districts"],
		queryFn: fetchDistricts,
	});

	// Fetch upazilas
	const { data: upazilas = [], isLoading: isUpazilasLoading } = useQuery({
		queryKey: ["upazilas"],
		queryFn: fetchUpazilas,
	});

	// Fetch unions when upazila is selected
	const { data: unions = [], isLoading: isUnionsLoading } = useQuery({
		queryKey: ["unions", selectedUpazilaId],
		queryFn: () => fetchUnionsByUpazila(selectedUpazilaId!),
		enabled: !!selectedUpazilaId,
	});

	const form = useForm<AddDoctorFormData>({
		resolver: zodResolver(addDoctorSchema),
		defaultValues: {
			name: "",
			bnName: "",
			email: "",
			phone: "",
			username: "",
			gender: "MALE",
			dateOfBirth: "",
			address: "",
			districtId: 1,
			upazilaId: 1,
			unionId: 1,
			bmdcNo: "",
			degrees: "",
			specializations: "",
			startDate: "",
			description: "",
			photo: "",
			isActive: true,
			isVerified: false,
		},
	});

	// Fetch doctor data if editing
	const {
		data: doctorData,
		isLoading: isDoctorLoading,
		isError: isDoctorError,
	} = useQuery<Doctor>({
		queryKey: ["doctor", doctorId],
		queryFn: () => fetchDoctorById(doctorId!),
		enabled: isEditing,
	});

	// Populate form when editing
	useEffect(() => {
		if (isEditing && doctorData) {
			const districtId = doctorData.profile.district?.id || 1;
			const upazilaId = doctorData.profile.upazila?.id || 1;

			form.reset({
				name: doctorData.profile.name || "",
				bnName: doctorData.profile.bnName || "",
				email: doctorData.profile.email || "",
				phone: doctorData.profile.phone || "",
				username: doctorData.profile.username || "",
				gender:
					(doctorData.profile.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
				dateOfBirth: doctorData.profile.dateOfBirth
					? doctorData.profile.dateOfBirth.split("T")[0]
					: "",
				address: doctorData.profile.address || "",
				districtId: districtId,
				upazilaId: upazilaId,
				unionId: doctorData.profile.union?.id || 1,
				bmdcNo: doctorData.bmdcNo || "",
				degrees: doctorData.degrees || "",
				specializations: doctorData.specializations || "",
				startDate: doctorData.startDate
					? doctorData.startDate.split("T")[0]
					: "",
				description: doctorData.description || "",
				photo: doctorData.profile.imageUrl || "",
				isActive: doctorData.isActive,
				isVerified: doctorData.isVerified,
			});

			// Set selected location values for dropdowns
			setSelectedDistrictId(districtId);
			setSelectedUpazilaId(upazilaId);
		}
	}, [doctorData, isEditing, form]);

	// Set initial selected values for new doctor
	useEffect(() => {
		if (!isEditing) {
			const formValues = form.getValues();
			setSelectedDistrictId(formValues.districtId);
			setSelectedUpazilaId(formValues.upazilaId);
		}
	}, [isEditing, form]);

	const onSubmit = async (data: AddDoctorFormData) => {
		try {
			setIsLoading(true);

			if (isEditing) {
				await updateDoctor(doctorId!, data);
				toast.success("Doctor updated successfully!");
			} else {
				await addDoctor(data);
				toast.success("Doctor added successfully!");
			}

			// Invalidate and refetch the doctors list
			queryClient.invalidateQueries({ queryKey: ["doctors"] });

			// Navigate back to doctors list
			router.push("/admin/doctors");
		} catch (error) {
			console.error("Error saving doctor:", error);
			toast.error(
				isEditing ? "Failed to update doctor" : "Failed to add doctor"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		router.push("/admin/doctors");
	};

	if (isEditing && isDoctorLoading) {
		return (
			<div className="flex flex-col">
				<AdminHeader
					title="Loading Doctor..."
					description="Please wait while we load the doctor information"
				/>
				<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
					<Card>
						<CardContent className="pt-6">
							<div className="space-y-4">
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isEditing && isDoctorError) {
		return (
			<div className="flex flex-col">
				<AdminHeader
					title="Error"
					description="Failed to load doctor information"
				/>
				<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-red-600">
								Failed to load doctor data. Please try again.
								<div className="mt-4">
									<Button onClick={handleBack} variant="outline">
										Back to Doctors List
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<AdminHeader
				title={isEditing ? "Edit Doctor" : "Add New Doctor"}
				description={
					isEditing
						? "Update doctor information and save changes"
						: "Fill in the information to add a new doctor to the system"
				}
			>
				<Button onClick={handleBack} variant="outline" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to List
				</Button>
			</AdminHeader>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Basic Information Card */}
							<Card>
								<CardHeader>
									<CardTitle>Basic Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter full name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bnName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Bengali Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter Bengali name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="Enter email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone</FormLabel>
												<FormControl>
													<Input placeholder="Enter phone number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input placeholder="Enter username" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="gender"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select gender" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="MALE">Male</SelectItem>
														<SelectItem value="FEMALE">Female</SelectItem>
														<SelectItem value="OTHER">Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="dateOfBirth"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date of Birth</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Address</FormLabel>
												<FormControl>
													<Textarea placeholder="Enter address" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="photo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Photo URL (Optional)</FormLabel>
												<FormControl>
													<Input placeholder="Enter photo URL" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Medical Information Card */}
							<Card>
								<CardHeader>
									<CardTitle>Medical Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="bmdcNo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>BMDC Number</FormLabel>
												<FormControl>
													<Input placeholder="Enter BMDC number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="degrees"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Degrees</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter degrees (e.g., MBBS, MD)"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="specializations"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Specializations</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter specializations"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="startDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Practice Start Date</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter description (optional)"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Location Information */}
									<div className="space-y-4">
										<h4 className="font-medium">Location Information</h4>
										<FormField
											control={form.control}
											name="districtId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>District</FormLabel>
													<FormControl>
														<SearchableSelect
															value={field.value?.toString()}
															onValueChange={(value) => {
																const districtId = Number(value);
																field.onChange(districtId);
																setSelectedDistrictId(districtId);
																// Reset upazila and union when district changes
																form.setValue("upazilaId", 1);
																form.setValue("unionId", 1);
																setSelectedUpazilaId(null);
															}}
															placeholder="Select district"
															searchPlaceholder="Search districts..."
															emptyText="No district found."
															disabled={isDistrictsLoading}
															options={districts.map((district: District) => ({
																value: district.id.toString(),
																label: district.name,
															}))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="upazilaId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Upazila</FormLabel>
													<FormControl>
														<SearchableSelect
															value={field.value?.toString()}
															onValueChange={(value) => {
																const upazilaId = Number(value);
																field.onChange(upazilaId);
																setSelectedUpazilaId(upazilaId);
																// Reset union when upazila changes
																form.setValue("unionId", 1);
															}}
															placeholder="Select upazila"
															searchPlaceholder="Search upazilas..."
															emptyText="No upazila found."
															disabled={
																isUpazilasLoading || !selectedDistrictId
															}
															options={upazilas
																.filter(
																	(upazila: Upazila) =>
																		upazila.district.id === selectedDistrictId
																)
																.map((upazila: Upazila) => ({
																	value: upazila.id.toString(),
																	label: upazila.name,
																}))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="unionId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Union</FormLabel>
													<FormControl>
														<SearchableSelect
															value={field.value?.toString()}
															onValueChange={(value) => {
																field.onChange(Number(value));
															}}
															placeholder="Select union"
															searchPlaceholder="Search unions..."
															emptyText="No union found."
															disabled={isUnionsLoading || !selectedUpazilaId}
															options={unions.map((union: Union) => ({
																value: union.id.toString(),
																label: union.name,
															}))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleBack}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<>Saving...</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										{isEditing ? "Update Doctor" : "Add Doctor"}
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
