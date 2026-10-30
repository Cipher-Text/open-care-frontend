"use client";

import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
	createPrescription,
	fetchDoctorContext,
	replacePrescription,
	updatePrescription,
} from "@/api/prescriptions";
import { Field, OptionSelect } from "@/components/admin/advertisements/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MealInstruction, Prescription, PrescriptionInput } from "@/types/prescriptions";
import { MedicinePicker } from "./medicine-picker";

const MEALS: { value: MealInstruction; label: string }[] = [
	{ value: "AFTER_MEAL", label: "After meal" },
	{ value: "BEFORE_MEAL", label: "Before meal" },
	{ value: "WITH_MEAL", label: "With meal" },
	{ value: "ANY_TIME", label: "Any time" },
];
const FREQUENCIES = ["1+0+1", "1+1+1", "1+0+0", "0+0+1", "0+1+0", "Once daily", "Twice daily", "As needed"];
const DURATIONS = ["3 days", "5 days", "7 days", "10 days", "14 days", "1 month", "Ongoing"];

// The form keeps everything as text; numbers are converted when the form is submitted.
const optionalNumber = (label: string, min: number, max: number, integer = false) =>
	z
		.string()
		.trim()
		.refine((v) => v === "" || (!Number.isNaN(Number(v)) && (!integer || Number.isInteger(Number(v)))), `${label} must be a ${integer ? "whole " : ""}number`)
		.refine((v) => v === "" || Number.isNaN(Number(v)) || (Number(v) >= min && Number(v) <= max), `${label} must be between ${min} and ${max}`);

const schema = z
	.object({
		hospitalId: z.string(),
		chiefComplaint: z.string().max(2000),
		weightKg: optionalNumber("Weight", 0, 500),
		temperatureCelsius: optionalNumber("Temperature", 25, 45),
		bloodPressureSystolic: optionalNumber("Systolic", 40, 300, true),
		bloodPressureDiastolic: optionalNumber("Diastolic", 20, 200, true),
		pulseRate: optionalNumber("Pulse", 20, 300, true),
		diagnosis: z.string().trim().min(1, "Diagnosis is required").max(2000),
		investigations: z.string().max(2000),
		advice: z.string().max(2000),
		nextVisitDate: z.string(),
		medicines: z
			.array(
				z.object({
					medicineId: z.number().optional(),
					medicineName: z.string().trim().min(1, "Choose or type a medicine").max(250),
					dosage: z.string().max(100),
					frequency: z.string().trim().min(1, "Required").max(100),
					duration: z.string().trim().min(1, "Required").max(100),
					mealInstruction: z.string(),
					instructions: z.string().max(1000),
				})
			)
			.min(1, "Add at least one medicine")
			.max(30, "At most 30 medicines"),
	})
	.refine(
		(v) =>
			v.bloodPressureSystolic === "" ||
			v.bloodPressureDiastolic === "" ||
			Number(v.bloodPressureDiastolic) < Number(v.bloodPressureSystolic),
		{ path: ["bloodPressureDiastolic"], message: "Must be lower than systolic" }
	);

type FormValues = z.infer<typeof schema>;

const EMPTY_LINE: FormValues["medicines"][number] = {
	medicineName: "",
	dosage: "",
	frequency: "",
	duration: "",
	mealInstruction: "AFTER_MEAL",
	instructions: "",
};

const num = (v: string) => (v.trim() === "" ? undefined : Number(v));
const text = (v: string) => (v.trim() === "" ? undefined : v.trim());

function toInput(v: FormValues, patientProfileId: number): PrescriptionInput {
	return {
		patientProfileId,
		hospitalId: v.hospitalId ? Number(v.hospitalId) : undefined,
		chiefComplaint: text(v.chiefComplaint),
		weightKg: num(v.weightKg),
		temperatureCelsius: num(v.temperatureCelsius),
		bloodPressureSystolic: num(v.bloodPressureSystolic),
		bloodPressureDiastolic: num(v.bloodPressureDiastolic),
		pulseRate: num(v.pulseRate),
		diagnosis: v.diagnosis.trim(),
		investigations: text(v.investigations),
		advice: text(v.advice),
		nextVisitDate: text(v.nextVisitDate),
		medicines: v.medicines.map((m) => ({
			medicineId: m.medicineId,
			medicineName: m.medicineName.trim(),
			dosage: text(m.dosage),
			frequency: m.frequency.trim(),
			duration: m.duration.trim(),
			mealInstruction: (text(m.mealInstruction) as MealInstruction | undefined),
			instructions: text(m.instructions),
		})),
	};
}

function fromPrescription(p: Prescription): FormValues {
	const s = (v: string | number | null | undefined) => (v == null ? "" : String(v));
	return {
		hospitalId: s(p.hospital?.id),
		chiefComplaint: s(p.chiefComplaint),
		weightKg: s(p.weightKg),
		temperatureCelsius: s(p.temperatureCelsius),
		bloodPressureSystolic: s(p.bloodPressureSystolic),
		bloodPressureDiastolic: s(p.bloodPressureDiastolic),
		pulseRate: s(p.pulseRate),
		diagnosis: p.diagnosis,
		investigations: s(p.investigations),
		advice: s(p.advice),
		nextVisitDate: s(p.nextVisitDate),
		medicines: p.medicines.map((m) => ({
			medicineId: m.medicineId ?? undefined,
			medicineName: m.medicineName,
			dosage: s(m.dosage),
			frequency: m.frequency,
			duration: m.duration,
			mealInstruction: s(m.mealInstruction),
			instructions: s(m.instructions),
		})),
	};
}

export interface PatientSummary {
	profileId: number;
	name: string;
	age: number | null;
	gender: string | null;
}

/**
 * A new prescription needs the consenting patient; an edit already knows its patient. With `replacing`, the form starts from
 * a prescription that can no longer be edited and saves a corrected copy: a new prescription that marks the old one as replaced.
 */
export function PrescriptionForm({ prescription, patient, replacing = false }: { prescription?: Prescription; patient?: PatientSummary; replacing?: boolean }) {
	const router = useRouter();
	const editing = !!prescription && !replacing;
	const subject: PatientSummary | undefined = prescription
		? { profileId: prescription.patientProfileId ?? 0, name: prescription.patientName, age: prescription.patientAge, gender: prescription.patientGender }
		: patient;
	const context = useQuery({ queryKey: ["prescription-doctor-context"], queryFn: fetchDoctorContext, staleTime: 10 * 60 * 1000 });

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: prescription
			? fromPrescription(prescription)
			: {
					hospitalId: "",
					chiefComplaint: "",
					weightKg: "",
					temperatureCelsius: "",
					bloodPressureSystolic: "",
					bloodPressureDiastolic: "",
					pulseRate: "",
					diagnosis: "",
					investigations: "",
					advice: "",
					nextVisitDate: "",
					medicines: [EMPTY_LINE],
			  },
	});
	const { register, control, handleSubmit, setValue, watch, formState } = form;
	const { errors } = formState;
	const lines = useFieldArray({ control, name: "medicines" });
	const hospitals = useMemo(() => context.data?.hospitals ?? [], [context.data]);


	// A doctor who works at exactly one hospital does not need to pick it
	useEffect(() => {
		if (!editing && hospitals.length === 1 && !watch("hospitalId")) setValue("hospitalId", String(hospitals[0].id));
	}, [editing, hospitals, setValue, watch]);

	const save = useMutation({
		mutationFn: (values: FormValues) => {
			const input = toInput(values, subject?.profileId ?? 0);
			if (prescription && replacing) return replacePrescription(prescription.id, input);
			return prescription ? updatePrescription(prescription.id, input) : createPrescription(input);
		},
		onSuccess: (saved) => {
			toast.success(replacing ? `Corrected prescription ${saved.prescriptionNo} saved. The old one is marked as replaced.` : editing ? "Prescription updated" : `Prescription ${saved.prescriptionNo} saved`);
			router.push(`/admin/prescriptions/${saved.id}`);
		},
	});

	return (
		<form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-6" noValidate>
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Patient</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<div>
						<p className="font-medium">{subject?.name ?? "No patient selected"}</p>
						<p className="text-sm text-muted-foreground">
							{[subject?.age != null ? `${subject.age} yrs` : null, subject?.gender?.toLowerCase(), "consent on record"]
								.filter(Boolean)
								.join(" · ")}
						</p>
					</div>
					<Field id="hospitalId" label="Chamber or hospital" hint="Printed on the prescription. Only places you work at are listed.">
						<Controller
							control={control}
							name="hospitalId"
							render={({ field }) => (
								<OptionSelect
									id="hospitalId"
									value={field.value}
									onChange={field.onChange}
									optional
									placeholder={context.isLoading ? "Loading..." : hospitals.length ? "Select" : "No workplace on your profile"}
									options={hospitals.map((h) => ({ value: String(h.id), label: h.name }))}
								/>
							)}
						/>
					</Field>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Examination</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Field id="chiefComplaint" label="Chief complaint" error={errors.chiefComplaint?.message}>
						<Textarea id="chiefComplaint" rows={2} {...register("chiefComplaint")} />
					</Field>
					<div className="grid gap-4 sm:grid-cols-5">
						<Field id="weightKg" label="Weight (kg)" error={errors.weightKg?.message}>
							<Input id="weightKg" inputMode="decimal" {...register("weightKg")} aria-invalid={!!errors.weightKg} />
						</Field>
						<Field id="temperatureCelsius" label="Temp (°C)" error={errors.temperatureCelsius?.message}>
							<Input id="temperatureCelsius" inputMode="decimal" {...register("temperatureCelsius")} aria-invalid={!!errors.temperatureCelsius} />
						</Field>
						<Field id="bloodPressureSystolic" label="BP systolic" error={errors.bloodPressureSystolic?.message}>
							<Input id="bloodPressureSystolic" inputMode="numeric" {...register("bloodPressureSystolic")} aria-invalid={!!errors.bloodPressureSystolic} />
						</Field>
						<Field id="bloodPressureDiastolic" label="BP diastolic" error={errors.bloodPressureDiastolic?.message}>
							<Input id="bloodPressureDiastolic" inputMode="numeric" {...register("bloodPressureDiastolic")} aria-invalid={!!errors.bloodPressureDiastolic} />
						</Field>
						<Field id="pulseRate" label="Pulse (/min)" error={errors.pulseRate?.message}>
							<Input id="pulseRate" inputMode="numeric" {...register("pulseRate")} aria-invalid={!!errors.pulseRate} />
						</Field>
					</div>
					<Field id="diagnosis" label="Diagnosis" required error={errors.diagnosis?.message}>
						<Textarea id="diagnosis" rows={2} {...register("diagnosis")} aria-invalid={!!errors.diagnosis} />
					</Field>
					<Field id="investigations" label="Investigations advised" error={errors.investigations?.message}>
						<Textarea id="investigations" rows={2} {...register("investigations")} />
					</Field>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<CardTitle className="text-lg">Medicines</CardTitle>
					<Button type="button" size="sm" variant="outline" onClick={() => lines.append(EMPTY_LINE)} disabled={lines.fields.length >= 30}>
						<Plus className="mr-1.5 size-4" aria-hidden="true" />
						Add medicine
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					{typeof errors.medicines?.message === "string" && (
						<p role="alert" className="text-sm text-destructive">
							{errors.medicines.message}
						</p>
					)}
					<datalist id="frequency-options">
						{FREQUENCIES.map((f) => (
							<option key={f} value={f} />
						))}
					</datalist>
					<datalist id="duration-options">
						{DURATIONS.map((d) => (
							<option key={d} value={d} />
						))}
					</datalist>
					{lines.fields.map((field, index) => {
						const lineErrors = errors.medicines?.[index];
						const linked = watch(`medicines.${index}.medicineId`) != null;
						return (
							<fieldset key={field.id} className="space-y-3 rounded-md border p-3">
								<legend className="px-1 text-sm font-medium text-muted-foreground">Medicine {index + 1}</legend>
								<Field id={`med-${index}-name`} label="Medicine" required error={lineErrors?.medicineName?.message}>
									<MedicinePicker
										id={`med-${index}-name`}
										value={watch(`medicines.${index}.medicineName`)}
										linked={linked}
										invalid={!!lineErrors?.medicineName}
										onTextChange={(textValue) => {
											setValue(`medicines.${index}.medicineName`, textValue, { shouldValidate: true });
											setValue(`medicines.${index}.medicineId`, undefined);
										}}
										onPick={(m) => {
											setValue(`medicines.${index}.medicineId`, m.id);
											setValue(
												`medicines.${index}.medicineName`,
												[m.brandName, m.strength, m.dosageForm ? `(${m.dosageForm})` : ""].filter(Boolean).join(" "),
												{ shouldValidate: true }
											);
										}}
									/>
								</Field>
								<div className="grid gap-3 sm:grid-cols-4">
									<Field id={`med-${index}-dosage`} label="Dose" error={lineErrors?.dosage?.message}>
										<Input id={`med-${index}-dosage`} placeholder="1 tablet" {...register(`medicines.${index}.dosage`)} />
									</Field>
									<Field id={`med-${index}-frequency`} label="How often" required error={lineErrors?.frequency?.message}>
										<Input id={`med-${index}-frequency`} list="frequency-options" {...register(`medicines.${index}.frequency`)} aria-invalid={!!lineErrors?.frequency} />
									</Field>
									<Field id={`med-${index}-duration`} label="For how long" required error={lineErrors?.duration?.message}>
										<Input id={`med-${index}-duration`} list="duration-options" {...register(`medicines.${index}.duration`)} aria-invalid={!!lineErrors?.duration} />
									</Field>
									<Field id={`med-${index}-meal`} label="With meals">
										<Controller
											control={control}
											name={`medicines.${index}.mealInstruction`}
											render={({ field }) => (
												<OptionSelect id={`med-${index}-meal`} value={field.value} onChange={field.onChange} optional placeholder="Select" options={MEALS} />
											)}
										/>
									</Field>
								</div>
								<div className="flex items-end gap-3">
									<div className="flex-1">
										<Field id={`med-${index}-notes`} label="Note" error={lineErrors?.instructions?.message}>
											<Input id={`med-${index}-notes`} {...register(`medicines.${index}.instructions`)} />
										</Field>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										aria-label={`Remove medicine ${index + 1}`}
										onClick={() => lines.remove(index)}
										disabled={lines.fields.length === 1}
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
							</fieldset>
						);
					})}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Advice and follow-up</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-3">
					<div className="sm:col-span-2">
						<Field id="advice" label="Advice" error={errors.advice?.message}>
							<Textarea id="advice" rows={3} {...register("advice")} />
						</Field>
					</div>
					<Field id="nextVisitDate" label="Next visit">
						<Input id="nextVisitDate" type="date" {...register("nextVisitDate")} />
					</Field>
				</CardContent>
			</Card>

			{save.isError && (
				<p role="alert" className="text-sm text-destructive">
					{(save.error as Error).message}
				</p>
			)}
			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline" onClick={() => router.back()} disabled={save.isPending}>
					Cancel
				</Button>
				<Button type="submit" disabled={save.isPending || !subject?.profileId}>
					{save.isPending ? "Saving..." : replacing ? "Save corrected prescription" : editing ? "Save changes" : "Save prescription"}
				</Button>
			</div>
		</form>
	);
}
