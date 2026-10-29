"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { addDoctor } from "@/api/doctors";
import {
	fetchDistricts,
	fetchUpazilas,
	fetchUnionsByUpazila,
} from "@/api/locations";
import {
	addDoctorSchema,
	AddDoctorFormData,
} from "@/validations/add-doctor-schema";
import { District, Upazila, Union } from "@/types/locations";

export default function AddDoctorPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
		null
	);
	const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(
		null
	);
	const router = useRouter();

	// Fetch districts
	const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
		queryKey: ["districts"],
		queryFn: fetchDistricts,
	});

	// Fetch upazilas when district is selected
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
			districtId: undefined,
			upazilaId: undefined,
			unionId: undefined,
			bmdcNo: "",
			startDate: "",
			description: "",
			photo: "",
			isActive: true,
			isVerified: false,
		},
	});

	// Set initial selected values based on form defaults
	useEffect(() => {
		const formValues = form.getValues();
		setSelectedDistrictId(formValues.districtId ?? null);
		setSelectedUpazilaId(formValues.upazilaId ?? null);
	}, [form]);

	const onSubmit = async (data: AddDoctorFormData) => {
		try {
			setIsLoading(true);
			await addDoctor(data);
			toast.success("Doctor added successfully!");
			router.push("/admin/doctors");
		} catch (error) {
			console.error("Error adding doctor:", error);
			toast.error("Failed to add doctor. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Add New Doctor"
				description="Fill in the information to add a new doctor to the system"
			/>

			<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
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
									<div className="space-y-4 pt-4 border-t">
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
															form.setValue("upazilaId", undefined);
															form.setValue("unionId", undefined);
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
															form.setValue("unionId", undefined);
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

						{/* Action Buttons */}
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/admin/doctors")}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Adding..." : "Add Doctor"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
