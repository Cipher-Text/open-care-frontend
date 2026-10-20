"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createAdvertisement,
	getAgeGroups,
	getAllAdvertisementTypes,
	getGenderOptions,
	updateAdvertisement,
} from "@/api/advertisements";
import { fetchDistricts, fetchUpazilasByDistrict } from "@/api/locations";
import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Advertisement, AdvertisementInput } from "@/types/advertisements";
import {
	AdvertisementFormData,
	advertisementSchema,
} from "@/validations/advertisement-schema";
import { Field, OptionSelect } from "./form-fields";

const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> value for <input type="datetime-local"> in the user's local time. */
const toLocalInput = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

const toNumber = (v: string) => (v === "" ? null : Number(v));
const orNull = (v: string) => (v.trim() === "" ? null : v.trim());
/** datetime-local gives "YYYY-MM-DDTHH:mm"; the API wants seconds too. */
const withSeconds = (v: string) => (v.length === 16 ? `${v}:00` : v);

function emptyForm(): AdvertisementFormData {
	const now = new Date();
	now.setSeconds(0, 0);
	const end = new Date(now);
	end.setDate(end.getDate() + 30);
	return {
		title: "",
		content: "",
		imageUrl: "",
		targetUrl: "",
		targetType: "doctor",
		targetId: "",
		advTypeId: "",
		districtId: "",
		upazilaId: "",
		medSpecialityId: "",
		ageGroup: "",
		gender: "",
		startTime: toLocalInput(now),
		endTime: toLocalInput(end),
		isActive: true,
	};
}

export function AdvertisementDialog({
	open,
	onOpenChange,
	advertisement,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Present when editing; omitted when creating. */
	advertisement?: Advertisement | null;
	onSaved: () => void;
}) {
	const editing = !!advertisement;

	const types = useQuery({ queryKey: ["advertisement-types-all"], queryFn: getAllAdvertisementTypes, enabled: open });
	const ageGroups = useQuery({ queryKey: ["age-groups"], queryFn: getAgeGroups, enabled: open });
	const genders = useQuery({ queryKey: ["gender-options"], queryFn: getGenderOptions, enabled: open });
	const districts = useQuery({ queryKey: ["districts"], queryFn: fetchDistricts, enabled: open });
	const specialities = useQuery({ queryKey: ["specialities-all"], queryFn: fetchAllMedicalSpecialities, enabled: open });

	const form = useForm<AdvertisementFormData>({
		resolver: zodResolver(advertisementSchema),
		defaultValues: emptyForm(),
	});
	const { register, control, handleSubmit, reset, setValue, watch, formState } = form;
	const { errors, dirtyFields } = formState;

	const districtId = watch("districtId");
	const upazilas = useQuery({
		queryKey: ["upazilas-by-district", districtId],
		queryFn: () => fetchUpazilasByDistrict(Number(districtId)),
		enabled: open && districtId !== "",
	});

	// Fill the form once per opening. When editing, wait for the option lists, because the
	// advertisement response carries age group and gender as display objects that must be
	// matched back to their option values.
	const filledFor = useRef<string | null>(null);
	useEffect(() => {
		if (!open) {
			filledFor.current = null;
			return;
		}
		const key = advertisement ? String(advertisement.id) : "new";
		if (filledFor.current === key) return;
		if (!advertisement) {
			reset(emptyForm());
			filledFor.current = key;
			return;
		}
		if (!ageGroups.data || !genders.data) return;

		const age = ageGroups.data.find(
			(a) => a.label === advertisement.ageGroup?.label && a.startAge === advertisement.ageGroup?.startAge
		);
		const gender = genders.data.find((g) => g.displayName === advertisement.gender?.name);
		reset({
			title: advertisement.title ?? "",
			content: advertisement.content ?? "",
			imageUrl: advertisement.imageUrl ?? "",
			targetUrl: advertisement.targetUrl ?? "",
			targetType: (advertisement.targetType as AdvertisementFormData["targetType"]) ?? "doctor",
			targetId: advertisement.targetId != null ? String(advertisement.targetId) : "",
			advTypeId: advertisement.advTypeId != null ? String(advertisement.advTypeId) : "",
			districtId: advertisement.districtId != null ? String(advertisement.districtId) : "",
			upazilaId: advertisement.upazilaId != null ? String(advertisement.upazilaId) : "",
			medSpecialityId: advertisement.medSpecialityId != null ? String(advertisement.medSpecialityId) : "",
			ageGroup: age?.value ?? "",
			gender: gender?.value ?? "",
			startTime: (advertisement.startTime ?? "").slice(0, 16),
			endTime: (advertisement.endTime ?? "").slice(0, 16),
			isActive: advertisement.isActive,
		});
		filledFor.current = key;
	}, [open, advertisement, ageGroups.data, genders.data, reset]);

	const save = useMutation({
		mutationFn: (data: AdvertisementFormData) => {
			// Union is not editable here; keep it only while district and upazila are unchanged
			const keepUnion =
				advertisement &&
				String(advertisement.districtId ?? "") === data.districtId &&
				String(advertisement.upazilaId ?? "") === data.upazilaId;
			const input: AdvertisementInput = {
				title: data.title.trim(),
				content: orNull(data.content),
				imageUrl: orNull(data.imageUrl),
				targetUrl: orNull(data.targetUrl),
				targetType: data.targetType,
				targetId: toNumber(data.targetId),
				advTypeId: Number(data.advTypeId),
				districtId: toNumber(data.districtId),
				upazilaId: data.districtId === "" ? null : toNumber(data.upazilaId),
				unionId: keepUnion ? advertisement?.unionId ?? null : null,
				medSpecialityId: toNumber(data.medSpecialityId),
				ageGroup: orNull(data.ageGroup),
				gender: orNull(data.gender),
				startTime: withSeconds(data.startTime),
				endTime: withSeconds(data.endTime),
				isActive: data.isActive,
			};
			return advertisement ? updateAdvertisement(advertisement.id, input) : createAdvertisement(input);
		},
		onSuccess: () => {
			toast.success(editing ? "Advertisement updated" : "Advertisement created");
			onSaved();
			onOpenChange(false);
		},
	});

	// New advertisement: choosing a type sets the end time from the type's duration, unless
	// the admin already edited the end time
	const onTypeChange = (value: string, apply: (v: string) => void) => {
		apply(value);
		const type = types.data?.find((t) => String(t.id) === value);
		const start = new Date(watch("startTime"));
		if (!editing && type && !dirtyFields.endTime && !Number.isNaN(start.getTime())) {
			start.setDate(start.getDate() + type.durationInDays);
			setValue("endTime", toLocalInput(start), { shouldValidate: true });
		}
	};

	return (
		<Dialog open={open} onOpenChange={(o) => !save.isPending && onOpenChange(o)}>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{editing ? "Edit advertisement" : "New advertisement"}</DialogTitle>
					<DialogDescription>
						Views and clicks are counted automatically and are not changed by editing.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4" noValidate>
					<Field id="ad-title" label="Title" required error={errors.title?.message}>
						<Input id="ad-title" {...register("title")} aria-invalid={!!errors.title} />
					</Field>

					<Field id="ad-content" label="Content" error={errors.content?.message} hint="Up to 1000 characters">
						<Textarea id="ad-content" rows={3} {...register("content")} aria-invalid={!!errors.content} />
					</Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field id="ad-image" label="Image URL" error={errors.imageUrl?.message} hint="https://...">
							<Input id="ad-image" inputMode="url" {...register("imageUrl")} aria-invalid={!!errors.imageUrl} />
						</Field>
						<Field id="ad-target-url" label="Link" error={errors.targetUrl?.message} hint="/doctors/12 or https://...">
							<Input id="ad-target-url" {...register("targetUrl")} aria-invalid={!!errors.targetUrl} />
						</Field>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<Field id="ad-type" label="Advertisement type" required error={errors.advTypeId?.message}>
							<Controller
								control={control}
								name="advTypeId"
								render={({ field }) => (
									<OptionSelect
										id="ad-type"
										value={field.value}
										onChange={(v) => onTypeChange(v, field.onChange)}
										invalid={!!errors.advTypeId}
										placeholder={types.isLoading ? "Loading..." : "Choose a type"}
										options={(types.data ?? []).map((t) => ({ value: String(t.id), label: t.name }))}
									/>
								)}
							/>
						</Field>
						<Field id="ad-target-type" label="Promotes" required error={errors.targetType?.message}>
							<Controller
								control={control}
								name="targetType"
								render={({ field }) => (
									<OptionSelect
										id="ad-target-type"
										value={field.value}
										onChange={field.onChange}
										invalid={!!errors.targetType}
										placeholder="Choose"
										options={[
											{ value: "doctor", label: "Doctor" },
											{ value: "hospital", label: "Hospital" },
											{ value: "institution", label: "Institution" },
										]}
									/>
								)}
							/>
						</Field>
						<Field id="ad-target-id" label="Promoted record ID" error={errors.targetId?.message}>
							<Input id="ad-target-id" inputMode="numeric" {...register("targetId")} aria-invalid={!!errors.targetId} />
						</Field>
					</div>

					<fieldset className="space-y-3 rounded-lg border p-3">
						<legend className="px-1 text-sm font-medium">Audience (optional)</legend>
						<div className="grid gap-4 sm:grid-cols-2">
							<Field id="ad-district" label="District">
								<Controller
									control={control}
									name="districtId"
									render={({ field }) => (
										<OptionSelect
											id="ad-district"
											value={field.value}
											onChange={(v) => {
												field.onChange(v);
												setValue("upazilaId", "");
											}}
											optional
											placeholder="Anywhere"
											options={(districts.data ?? [])
												.slice()
												.sort((a, b) => a.name.localeCompare(b.name))
												.map((d) => ({ value: String(d.id), label: d.name }))}
										/>
									)}
								/>
							</Field>
							<Field id="ad-upazila" label="Upazila">
								<Controller
									control={control}
									name="upazilaId"
									render={({ field }) => (
										<OptionSelect
											id="ad-upazila"
											value={field.value}
											onChange={field.onChange}
											optional
											disabled={districtId === ""}
											placeholder={districtId === "" ? "Choose a district first" : "Whole district"}
											options={(upazilas.data ?? [])
												.slice()
												.sort((a, b) => a.name.localeCompare(b.name))
												.map((u) => ({ value: String(u.id), label: u.name }))}
										/>
									)}
								/>
							</Field>
							<Field id="ad-speciality" label="Medical speciality">
								<Controller
									control={control}
									name="medSpecialityId"
									render={({ field }) => (
										<OptionSelect
											id="ad-speciality"
											value={field.value}
											onChange={field.onChange}
											optional
											placeholder="Any"
											options={(specialities.data ?? [])
												.slice()
												.sort((a, b) => a.name.localeCompare(b.name))
												.map((s) => ({ value: String(s.id), label: s.name }))}
										/>
									)}
								/>
							</Field>
							<div className="grid grid-cols-2 gap-4">
								<Field id="ad-age" label="Age group">
									<Controller
										control={control}
										name="ageGroup"
										render={({ field }) => (
											<OptionSelect
												id="ad-age"
												value={field.value}
												onChange={field.onChange}
												optional
												placeholder="Any"
												options={(ageGroups.data ?? []).map((a) => ({
													value: a.value,
													label: `${a.startAge}-${a.endAge >= 200 ? "+" : a.endAge}`,
												}))}
											/>
										)}
									/>
								</Field>
								<Field id="ad-gender" label="Gender">
									<Controller
										control={control}
										name="gender"
										render={({ field }) => (
											<OptionSelect
												id="ad-gender"
												value={field.value}
												onChange={field.onChange}
												optional
												placeholder="Any"
												options={(genders.data ?? []).map((g) => ({ value: g.value, label: g.displayName }))}
											/>
										)}
									/>
								</Field>
							</div>
						</div>
					</fieldset>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field id="ad-start" label="Starts" required error={errors.startTime?.message}>
							<Input id="ad-start" type="datetime-local" {...register("startTime")} aria-invalid={!!errors.startTime} />
						</Field>
						<Field id="ad-end" label="Ends" required error={errors.endTime?.message}>
							<Input id="ad-end" type="datetime-local" {...register("endTime")} aria-invalid={!!errors.endTime} />
						</Field>
					</div>

					<Controller
						control={control}
						name="isActive"
						render={({ field }) => (
							<div className="flex items-center gap-2">
								<Checkbox id="ad-active" checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
								<Label htmlFor="ad-active" className="font-normal">
									Active (shown to visitors during its dates)
								</Label>
							</div>
						)}
					/>

					{save.isError && (
						<p role="alert" className="text-sm text-destructive">
							{(save.error as Error).message}
						</p>
					)}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={save.isPending}>
							Cancel
						</Button>
						<Button type="submit" disabled={save.isPending}>
							{save.isPending ? "Saving..." : editing ? "Save changes" : "Create advertisement"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
