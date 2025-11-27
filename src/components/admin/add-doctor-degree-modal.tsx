"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
	fetchDegrees,
	addDoctorDegreesBatch,
	fetchDoctorDegrees,
} from "@/api/degrees";
import { fetchAllInstitutions } from "@/api/institutions";
import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { DoctorDegree } from "@/types/degrees";

const degreeSchema = z.object({
	degreeId: z.string().min(1, "Degree is required"),
	medicalSpecialityId: z.string().min(1, "Specialization is required"),
	institutionId: z.string().min(1, "Institution is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	grade: z.string().optional(),
	description: z.string().optional(),
});

const addDegreesFormSchema = z.object({
	degrees: z.array(degreeSchema).min(1, "Add at least one degree"),
});

type AddDegreesFormData = z.infer<typeof addDegreesFormSchema>;

interface AddDoctorDegreeModalProps {
	isOpen: boolean;
	onClose: () => void;
	doctorId: string;
	onSuccess?: () => void;
}

export function AddDoctorDegreeModal({
	isOpen,
	onClose,
	doctorId,
	onSuccess,
}: AddDoctorDegreeModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	// Fetch dropdowns data
	const { data: degrees = [] } = useQuery({
		queryKey: ["degrees"],
		queryFn: fetchDegrees,
	});

	const { data: institutions = [] } = useQuery({
		queryKey: ["institutions-all"],
		queryFn: fetchAllInstitutions,
	});

	const { data: specialities = [] } = useQuery({
		queryKey: ["specialities-all"],
		queryFn: fetchAllMedicalSpecialities,
	});

	// Fetch existing doctor degrees for edit mode
	const { data: existingDegrees = [], isLoading: isLoadingDegrees } = useQuery({
		queryKey: ["doctor-degrees", doctorId],
		queryFn: () => fetchDoctorDegrees(doctorId),
		enabled: isOpen && !!doctorId,
	});

	const form = useForm<AddDegreesFormData>({
		resolver: zodResolver(addDegreesFormSchema),
		defaultValues: {
			degrees: [
				{
					degreeId: "",
					medicalSpecialityId: "",
					institutionId: "",
					startDate: "",
					endDate: "",
					grade: "",
					description: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "degrees",
	});

	// Update form when existing degrees are loaded
	useEffect(() => {
		if (
			isOpen &&
			existingDegrees &&
			existingDegrees.length > 0 &&
			!isLoadingDegrees
		) {
			// Clear current fields
			while (fields.length > 0) {
				remove(0);
			}

			// Add existing degrees to form
			existingDegrees.forEach((degree) => {
				append({
					degreeId: degree.degreeId.toString(),
					medicalSpecialityId: degree.medicalSpecialityId.toString(),
					institutionId: degree.institutionId.toString(),
					startDate: degree.startDate,
					endDate: degree.endDate,
					grade: degree.grade || "",
					description: degree.description || "",
				});
			});
		}
	}, [
		isOpen,
		existingDegrees,
		isLoadingDegrees,
		fields.length,
		append,
		remove,
	]);

	const onSubmit = async (data: AddDegreesFormData) => {
		try {
			setIsLoading(true);

			const degreesData: DoctorDegree[] = data.degrees.map((degree) => ({
				doctorId: parseInt(doctorId),
				degreeId: parseInt(degree.degreeId),
				medicalSpecialityId: parseInt(degree.medicalSpecialityId),
				institutionId: parseInt(degree.institutionId),
				startDate: degree.startDate,
				endDate: degree.endDate,
				grade: degree.grade || "",
				description: degree.description || "",
				endDateValid: true,
			}));

			await addDoctorDegreesBatch(doctorId, degreesData);
			toast.success(
				`${degreesData.length} degree${
					degreesData.length !== 1 ? "s" : ""
				} added successfully!`
			);

			// Reset and close modal
			form.reset();
			onClose();

			// Call success callback if provided
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error adding degrees:", error);
			toast.error("Failed to add degrees. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-full w-[95vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Doctor Degrees</DialogTitle>
					<DialogDescription>
						Add one or multiple degrees for this doctor
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Degrees Field Array */}
						{fields.map((field, index) => (
							<Card key={field.id} className="p-4 relative">
								{/* Remove button */}
								{fields.length > 1 && (
									<button
										type="button"
										onClick={() => remove(index)}
										className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded transition-colors"
									>
										<X className="h-4 w-4 text-red-600" />
									</button>
								)}

								<div className="space-y-4">
									{/* Row 1: Degree and Institution */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name={`degrees.${index}.degreeId`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Degree</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select a degree" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="min-w-[300px]">
															{degrees.map((degree) => (
																<SelectItem
																	key={degree.id}
																	value={degree.id.toString()}
																>
																	{degree.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`degrees.${index}.institutionId`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Institution</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select an institution" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="min-w-[300px]">
															{institutions.map((institution) => (
																<SelectItem
																	key={institution.id}
																	value={institution.id.toString()}
																>
																	{institution.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Row 2: Specialization and Dates */}
									<div className="space-y-4">
										<FormField
											control={form.control}
											name={`degrees.${index}.medicalSpecialityId`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Specialization</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select a specialization" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="min-w-[300px]">
															{specialities.map((speciality) => (
																<SelectItem
																	key={speciality.id}
																	value={speciality.id.toString()}
																>
																	{speciality.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name={`degrees.${index}.startDate`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Start Date</FormLabel>
														<FormControl>
															<Input type="date" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`degrees.${index}.endDate`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>End Date</FormLabel>
														<FormControl>
															<Input type="date" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Row 3: Grade and Description */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name={`degrees.${index}.grade`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Grade (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="Enter grade" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name={`degrees.${index}.description`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description (Optional)</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter description"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</Card>
						))}

						{/* Add Degree Button */}
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								append({
									degreeId: "",
									medicalSpecialityId: "",
									institutionId: "",
									startDate: "",
									endDate: "",
									grade: "",
									description: "",
								})
							}
							className="w-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Another Degree
						</Button>

						{/* Form Actions */}
						<div className="flex gap-2 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading || fields.length === 0}
								className="flex-1"
							>
								{isLoading
									? "Saving..."
									: `Save ${fields.length} Degree${
											fields.length !== 1 ? "s" : ""
									  }`}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
