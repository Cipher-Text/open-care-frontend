"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

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

import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { fetchAllInstitutions } from "@/api/institutions";
import { fetchAllHospitals } from "@/api/hospitals";
import { fetchTeacherPositions } from "@/api/teacher-positions";
import { addDoctorWorkplacesBatch } from "@/api/workplaces";
import { DoctorWorkplaceRequest } from "@/types/workplaces";
import { MedicalSpeciality } from "@/types/doctors";
import { Institution } from "@/types/institutions";
import { Hospital } from "@/types/hospitals";
import { TeacherPosition } from "@/types/teacher-positions";

const workplaceSchema = z
	.object({
		id: z.number().optional(),
		workplaceType: z.enum(["DOCTOR", "TEACHER"]),
		medicalSpecialityId: z.string().min(1, "Specialization is required"),
		institutionId: z.string().optional(),
		hospitalId: z.string().optional(),
		doctorPosition: z.string().optional(),
		teacherPosition: z.string().optional(),
		startDate: z.string().min(1, "Start date is required"),
		endDate: z.string().min(1, "End date is required"),
		description: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.workplaceType === "TEACHER") {
			if (!data.institutionId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Institution is required",
					path: ["institutionId"],
				});
			}
			if (!data.teacherPosition) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Teacher position is required",
					path: ["teacherPosition"],
				});
			}
		}

		if (data.workplaceType === "DOCTOR") {
			if (!data.hospitalId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Hospital is required",
					path: ["hospitalId"],
				});
			}
			if (!data.doctorPosition) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Doctor position is required",
					path: ["doctorPosition"],
				});
			}
		}
	});

const addWorkplacesSchema = z.object({
	workplaces: z.array(workplaceSchema).min(1, "Add at least one workplace"),
});

type AddWorkplacesFormData = z.infer<typeof addWorkplacesSchema>;
type WorkplaceFormValues = AddWorkplacesFormData["workplaces"][number];

const emptyWorkplace: WorkplaceFormValues = {
	id: undefined,
	workplaceType: "DOCTOR",
	medicalSpecialityId: "",
	institutionId: "",
	hospitalId: "",
	doctorPosition: "",
	teacherPosition: "",
	startDate: "",
	endDate: "",
	description: "",
};

interface AddDoctorWorkplaceModalProps {
	isOpen: boolean;
	onClose: () => void;
	doctorId: string;
	onSuccess?: () => void;
	initialWorkplaces?: WorkplaceFormValues[];
}

export function AddDoctorWorkplaceModal({
	isOpen,
	onClose,
	doctorId,
	onSuccess,
	initialWorkplaces,
}: AddDoctorWorkplaceModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const { data: specialities = [] } = useQuery<MedicalSpeciality[]>({
		queryKey: ["specialities-all"],
		queryFn: fetchAllMedicalSpecialities,
	});

	const { data: institutions = [] } = useQuery<Institution[]>({
		queryKey: ["institutions-all"],
		queryFn: fetchAllInstitutions,
	});

	const { data: hospitals = [] } = useQuery<Hospital[]>({
		queryKey: ["hospitals-all"],
		queryFn: fetchAllHospitals,
	});

	const { data: teacherPositions = [] } = useQuery<TeacherPosition[]>({
		queryKey: ["teacher-positions"],
		queryFn: fetchTeacherPositions,
	});

	const form = useForm<AddWorkplacesFormData>({
		resolver: zodResolver(addWorkplacesSchema),
		defaultValues: {
			workplaces: [emptyWorkplace],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "workplaces",
	});

	const hasInitialWorkplaces = (initialWorkplaces?.length || 0) > 0;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (hasInitialWorkplaces) {
			form.reset({ workplaces: initialWorkplaces || [] });
			return;
		}

		form.reset({ workplaces: [emptyWorkplace] });
	}, [form, hasInitialWorkplaces, initialWorkplaces, isOpen]);

	const specialitiesOptions = useMemo(
		() =>
			specialities.map((speciality) => ({
				value: speciality.id.toString(),
				label: speciality.name,
			})),
		[specialities]
	);

	const onSubmit = async (data: AddWorkplacesFormData) => {
		try {
			setIsLoading(true);

			const workplacesData: DoctorWorkplaceRequest[] = data.workplaces.map(
				(workplace) => ({
					id: workplace.id,
					doctorId: parseInt(doctorId),
					medicalSpecialityId: parseInt(workplace.medicalSpecialityId),
					institutionId:
						workplace.workplaceType === "TEACHER" && workplace.institutionId
							? parseInt(workplace.institutionId)
							: null,
					hospitalId:
						workplace.workplaceType === "DOCTOR" && workplace.hospitalId
							? parseInt(workplace.hospitalId)
							: null,
					doctorPosition:
						workplace.workplaceType === "DOCTOR"
							? workplace.doctorPosition || ""
							: null,
					teacherPosition:
						workplace.workplaceType === "TEACHER"
							? workplace.teacherPosition || ""
							: null,
					startDate: workplace.startDate,
					endDate: workplace.endDate,
					description: workplace.description || "",
					update: Boolean(workplace.id),
					endDateValid: true,
				})
			);

			await addDoctorWorkplacesBatch(doctorId, workplacesData);
			toast.success(
				`${workplacesData.length} workplace${
					workplacesData.length !== 1 ? "s" : ""
				} saved successfully!`
			);

			form.reset();
			onClose();

			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error saving workplaces:", error);
			toast.error("Failed to save workplaces. Please try again.");
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
					<DialogTitle>
						{hasInitialWorkplaces
							? "Edit Doctor Workplaces"
							: "Add Doctor Workplaces"}
					</DialogTitle>
					<DialogDescription>
						{hasInitialWorkplaces
							? "Update existing workplaces or add new ones"
							: "Add one or multiple workplaces for this doctor"}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{fields.map((field, index) => {
							const workplaceType = form.watch(
								`workplaces.${index}.workplaceType`
							);

							return (
								<Card key={field.id} className="p-4 relative">
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
										<div className="flex flex-wrap gap-2">
											<Button
												type="button"
												size="sm"
												variant={
													workplaceType === "DOCTOR" ? "default" : "outline"
												}
												onClick={() =>
													form.setValue(
														`workplaces.${index}.workplaceType`,
														"DOCTOR"
													)
												}
											>
												Doctor
											</Button>
											<Button
												type="button"
												size="sm"
												variant={
													workplaceType === "TEACHER" ? "default" : "outline"
												}
												onClick={() =>
													form.setValue(
														`workplaces.${index}.workplaceType`,
														"TEACHER"
													)
												}
											>
												Teacher
											</Button>
										</div>

										<FormField
											control={form.control}
											name={`workplaces.${index}.medicalSpecialityId`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Medical Speciality</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select speciality" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="min-w-[300px]">
															{specialitiesOptions.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{workplaceType === "TEACHER" ? (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name={`workplaces.${index}.institutionId`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Institution</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
															>
																<FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Select institution" />
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
												<FormField
													control={form.control}
													name={`workplaces.${index}.teacherPosition`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Teacher Position</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
															>
																<FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Select position" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{teacherPositions.map((position) => (
																		<SelectItem
																			key={position.value}
																			value={position.value}
																		>
																			{position.displayName ||
																				position.banglaName ||
																				position.value}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										) : (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name={`workplaces.${index}.hospitalId`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Hospital</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
															>
																<FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Select hospital" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="min-w-[300px]">
																	{hospitals.map((hospital) => (
																		<SelectItem
																			key={hospital.id}
																			value={hospital.id.toString()}
																		>
																			{hospital.name || hospital.bnName}
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
													name={`workplaces.${index}.doctorPosition`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Doctor Position</FormLabel>
															<FormControl>
																<Input
																	placeholder="Enter doctor position"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name={`workplaces.${index}.startDate`}
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
												name={`workplaces.${index}.endDate`}
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

										<FormField
											control={form.control}
											name={`workplaces.${index}.description`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (Optional)</FormLabel>
													<FormControl>
														<Textarea placeholder="Enter description" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</Card>
							);
						})}

						<Button
							type="button"
							variant="outline"
							onClick={() => append(emptyWorkplace)}
							className="w-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Another Workplace
						</Button>

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
									: `Save ${fields.length} Workplace${
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
