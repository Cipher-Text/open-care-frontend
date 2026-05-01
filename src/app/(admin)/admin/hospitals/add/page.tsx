"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

import {
	addHospital,
	fetchHospitalTypes,
	fetchOrganizationTypes,
} from "@/api/hospitals";
import {
	fetchDistricts,
	fetchUpazilas,
	fetchUnionsByUpazila,
} from "@/api/locations";
import {
	addHospitalSchema,
	AddHospitalFormInput,
	AddHospitalFormData,
} from "@/validations/add-hospital-schema";

export default function AddHospitalPage() {
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

	// Fetch hospital types
	const { data: hospitalTypes = [], isLoading: isHospitalTypesLoading } =
		useQuery({
			queryKey: ["hospital-types"],
			queryFn: fetchHospitalTypes,
		});

	// Fetch organization types
	const {
		data: organizationTypes = [],
		isLoading: isOrganizationTypesLoading,
	} = useQuery({
		queryKey: ["organization-types"],
		queryFn: fetchOrganizationTypes,
	});

	const form = useForm<AddHospitalFormInput, unknown, AddHospitalFormData>({
		resolver: zodResolver(addHospitalSchema),
		defaultValues: {
			name: "",
			bnName: "",
			numberOfBed: 1,
			districtId: 1,
			upazilaId: 1,
			unionId: 1,
			hospitalType: "",
			organizationType: "",
			lat: undefined,
			lon: undefined,
			websiteUrl: "",
			imageUrl: "",
			registrationCode: "",
			slug: "",
			facebookPageUrl: "",
			twitterProfileUrl: "",
			email: "",
			phone: "",
			address: "",
			hasEmergencyService: false,
			hasAmbulanceService: false,
			hasBloodBank: false,
			isAffiliated: false,
			isActive: true,
		},
	});

	// Set initial selected values based on form defaults
	useEffect(() => {
		const formValues = form.getValues();
		const districtId =
			typeof formValues.districtId === "number"
				? formValues.districtId
				: typeof formValues.districtId === "string" &&
					formValues.districtId.trim() !== "" &&
					!Number.isNaN(Number(formValues.districtId))
				? Number(formValues.districtId)
				: null;
		const upazilaId =
			typeof formValues.upazilaId === "number"
				? formValues.upazilaId
				: typeof formValues.upazilaId === "string" &&
					formValues.upazilaId.trim() !== "" &&
					!Number.isNaN(Number(formValues.upazilaId))
				? Number(formValues.upazilaId)
				: null;

		setSelectedDistrictId(districtId ?? 1);
		setSelectedUpazilaId(upazilaId ?? 1);
	}, [form]);

	// Filter upazilas based on selected district
	const filteredUpazilas = upazilas.filter(
		(upazila) =>
			!selectedDistrictId || upazila.district.id === selectedDistrictId
	);

	// Filter unions based on selected upazila
	const filteredUnions = unions;

	const onSubmit = async (data: AddHospitalFormData) => {
		try {
			setIsLoading(true);
			await addHospital(data);
			toast.success("Hospital added successfully!");
			router.push("/admin/hospitals");
		} catch (error) {
			console.error("Error adding hospital:", error);
			toast.error("Failed to add hospital. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		router.push("/admin/hospitals");
	};

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Add New Hospital"
				description="Fill in the information to add a new hospital to the system"
			>
				<Button onClick={handleBack} variant="outline" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to List
				</Button>
			</AdminHeader>

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
												<FormLabel>Hospital Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter hospital name" {...field} />
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
													<Input placeholder="বাংলা নাম লিখুন" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="numberOfBed"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Number of Beds</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="Enter number of beds"
														name={field.name}
														onBlur={field.onBlur}
														ref={field.ref}
														disabled={field.disabled}
														value={
															typeof field.value === "number" ||
															typeof field.value === "string"
																? field.value
																: ""
														}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hospitalType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Hospital Type</FormLabel>
						<Select
							onValueChange={field.onChange}
							value={typeof field.value === "string" ? field.value : ""}
							disabled={isHospitalTypesLoading}
						>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select hospital type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{isHospitalTypesLoading ? (
															<SelectItem
																value="hospital-types-loading"
																disabled
															>
																Loading hospital types...
															</SelectItem>
														) : (
															hospitalTypes
																.filter(
																	(type) =>
																		type.englishName &&
																		type.englishName.trim() !== ""
																)
																.map((type) => {
																	const optionValue =
																		type.value || type.englishName;
																	return (
																		<SelectItem
																			key={optionValue}
																			value={optionValue}
																		>
																			{type.englishName} ({type.banglaName})
																		</SelectItem>
																	);
																})
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="organizationType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Organization Type</FormLabel>
						<Select
							onValueChange={field.onChange}
							value={typeof field.value === "string" ? field.value : ""}
							disabled={isOrganizationTypesLoading}
						>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select organization type" />
														</SelectTrigger>
													</FormControl>
											<SelectContent>
												{isOrganizationTypesLoading ? (
													<SelectItem
														value="organization-types-loading"
														disabled
													>
														Loading organization types...
													</SelectItem>
												) : (
													organizationTypes
														.filter(
															(type) =>
																(type.value || type.displayName) &&
																(type.value || type.displayName || "").trim() !== ""
														)
														.map((type) => {
															const optionValue =
																type.value || type.displayName || "";
															const label =
																type.displayName || type.englishName || optionValue;
															return (
																<SelectItem
																	key={optionValue}
																	value={optionValue}
																>
																	{label} ({type.banglaName})
																</SelectItem>
															);
														})
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="registrationCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Registration Code (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Enter registration code" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Slug (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="hospital-slug" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="imageUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image URL (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="https://..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Contact & Online</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="websiteUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Website URL (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="https://example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="facebookPageUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Facebook Page URL (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="facebook.com/..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="twitterProfileUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Twitter Profile URL (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="twitter.com/..." {...field} />
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
										<FormLabel>Email (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="name@example.com" {...field} />
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
										<FormLabel>Phone (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="+880..." {...field} />
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
										<FormLabel>Address (Optional)</FormLabel>
										<FormControl>
											<Textarea placeholder="Enter address" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Location Information Card */}
					<Card>
						<CardHeader>
							<CardTitle>Location Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="districtId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>District</FormLabel>
												<Select
													onValueChange={(value) => {
														const districtId = Number(value);
														field.onChange(districtId);
														setSelectedDistrictId(districtId);
														// Reset upazila and union when district changes
														form.setValue("upazilaId", 1);
														form.setValue("unionId", 1);
														setSelectedUpazilaId(null);
													}}
													value={
														typeof field.value === "number" ||
														typeof field.value === "string"
															? String(field.value)
															: ""
													}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select district" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{isDistrictsLoading ? (
															<SelectItem value="districts-loading" disabled>
																Loading...
															</SelectItem>
														) : (
															districts.map((district) => (
																<SelectItem
																	key={district.id}
																	value={district.id.toString()}
																>
																	{district.name}
																</SelectItem>
															))
														)}
													</SelectContent>
												</Select>
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
												<Select
													onValueChange={(value) => {
														const upazilaId = Number(value);
														field.onChange(upazilaId);
														setSelectedUpazilaId(upazilaId);
														// Reset union when upazila changes
														form.setValue("unionId", 1);
													}}
													value={
														typeof field.value === "number" ||
														typeof field.value === "string"
															? String(field.value)
															: ""
													}
													disabled={!selectedDistrictId}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select upazila" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{isUpazilasLoading ? (
															<SelectItem value="upazilas-loading" disabled>
																Loading...
															</SelectItem>
														) : (
															filteredUpazilas.map((upazila) => (
																<SelectItem
																	key={upazila.id}
																	value={upazila.id.toString()}
																>
																	{upazila.name}
																</SelectItem>
															))
														)}
													</SelectContent>
												</Select>
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
												<Select
													onValueChange={(value) =>
														field.onChange(Number(value))
													}
													value={
														typeof field.value === "number" ||
														typeof field.value === "string"
															? String(field.value)
															: ""
													}
													disabled={!selectedUpazilaId}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select union" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{isUnionsLoading ? (
															<SelectItem value="unions-loading" disabled>
																Loading...
															</SelectItem>
														) : (
															filteredUnions.map((union) => (
																<SelectItem
																	key={union.id}
																	value={union.id.toString()}
																>
																	{union.name}
																</SelectItem>
															))
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="lat"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Latitude (Optional)</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="any"
														placeholder="23.7104"
														name={field.name}
														onBlur={field.onBlur}
														ref={field.ref}
														disabled={field.disabled}
														value={
															typeof field.value === "number" ||
															typeof field.value === "string"
																? field.value
																: ""
														}
														onChange={(e) => {
															const nextValue = e.target.value;
															field.onChange(
																nextValue === ""
																		? undefined
																		: Number.parseFloat(nextValue)
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									<FormField
										control={form.control}
										name="lon"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Longitude (Optional)</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="any"
														placeholder="90.4074"
														name={field.name}
														onBlur={field.onBlur}
														ref={field.ref}
														disabled={field.disabled}
														value={
															typeof field.value === "number" ||
															typeof field.value === "string"
																? field.value
																: ""
														}
														onChange={(e) => {
															const nextValue = e.target.value;
															field.onChange(
																nextValue === ""
																		? undefined
																		: Number.parseFloat(nextValue)
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Services & Status</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="hasEmergencyService"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Emergency Service</FormLabel>
													<div className="text-sm text-muted-foreground">
														Supports emergency care.
													</div>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hasAmbulanceService"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Ambulance Service</FormLabel>
													<div className="text-sm text-muted-foreground">
														Provides ambulance services.
													</div>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hasBloodBank"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Blood Bank</FormLabel>
													<div className="text-sm text-muted-foreground">
														Has blood bank facilities.
													</div>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="isAffiliated"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Affiliated</FormLabel>
													<div className="text-sm text-muted-foreground">
														Affiliated with another institution.
													</div>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="isActive"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Active</FormLabel>
													<div className="text-sm text-muted-foreground">
														Show this hospital as active.
													</div>
												</div>
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleBack}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Adding..." : "Add Hospital"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
