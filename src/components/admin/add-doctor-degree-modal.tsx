"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
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
import { fetchDegrees } from "@/api/degrees";
import { fetchAllInstitutions } from "@/api/institutions";
import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { addDoctorDegree, AddDoctorDegreeRequest } from "@/api/doctors";

const addDegreeSchema = z.object({
	degreeId: z.string().min(1, "Degree is required"),
	medicalSpecialityId: z.string().min(1, "Specialization is required"),
	institutionId: z.string().min(1, "Institution is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	grade: z.string().optional(),
	description: z.string().optional(),
});

type AddDegreeFormData = z.infer<typeof addDegreeSchema>;

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

	const form = useForm<AddDegreeFormData>({
		resolver: zodResolver(addDegreeSchema),
		defaultValues: {
			degreeId: "",
			medicalSpecialityId: "",
			institutionId: "",
			startDate: "",
			endDate: "",
			grade: "",
			description: "",
		},
	});

	const onSubmit = async (data: AddDegreeFormData) => {
		try {
			setIsLoading(true);

			const requestData: AddDoctorDegreeRequest = {
				doctorId: parseInt(doctorId),
				degreeId: parseInt(data.degreeId),
				medicalSpecialityId: parseInt(data.medicalSpecialityId),
				institutionId: parseInt(data.institutionId),
				startDate: data.startDate,
				endDate: data.endDate,
				grade: data.grade || "",
				description: data.description || "",
				endDateValid: true,
			};

			await addDoctorDegree(doctorId, requestData);
			toast.success("Doctor degree added successfully!");

			// Reset form and close modal
			form.reset();
			onClose();

			// Call success callback if provided
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error adding degree:", error);
			toast.error("Failed to add degree. Please try again.");
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
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Doctor Degree</DialogTitle>
					<DialogDescription>
						Add a new degree for this doctor
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="degreeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Degree</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a degree" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
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
							name="institutionId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Institution</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select an institution" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
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
							name="medicalSpecialityId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Specialization</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a specialization" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
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

						<FormField
							control={form.control}
							name="startDate"
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
							name="endDate"
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

						<FormField
							control={form.control}
							name="grade"
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

						<FormField
							control={form.control}
							name="description"
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

						<div className="flex gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading} className="flex-1">
								{isLoading ? "Adding..." : "Add Degree"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
