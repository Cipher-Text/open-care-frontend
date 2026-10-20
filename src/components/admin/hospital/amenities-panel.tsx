"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AmenityInput, createAmenity, deleteAmenity, updateAmenity } from "@/api/hospital-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/admin/advertisements/confirm-delete-dialog";
import { Field, OptionSelect } from "@/components/admin/advertisements/form-fields";
import { usePermissions } from "@/hooks/use-permissions";
import { HospitalAmenity } from "@/types/hospitals";
import { EmptyRow, ManageSection } from "./manage-section";

/** Amenity types the platform already uses (hospital_amenity.type). */
const TYPES = [
	"GENERAL_BED",
	"CABIN",
	"VIP_CABIN",
	"OT",
	"EMERGENCY",
	"ELEVATOR",
	"WASHROOM",
	"CAFETERIA",
	"PRAYER_ROOM",
	"SECURITY",
];
const ACRONYMS: Record<string, string> = { OT: "Operation theatre", VIP_CABIN: "VIP cabin" };
const label = (type: string) =>
	ACRONYMS[type] ?? type.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const schema = z
	.object({
		type: z.string().min(1, "Choose a type"),
		name: z.string().trim().min(1, "Name is required").max(100, "At most 100 characters"),
		price: z.number({ message: "Enter a number" }).int("Whole taka only").min(0, "Cannot be negative"),
		quantity: z.number({ message: "Enter a number" }).int().min(0, "Cannot be negative"),
		available: z.number({ message: "Enter a number" }).int().min(0, "Cannot be negative"),
		isActive: z.boolean(),
	})
	.refine((v) => v.available <= v.quantity, { path: ["available"], message: "Cannot exceed the total quantity" });

const EMPTY: AmenityInput = { type: "", name: "", price: 0, quantity: 1, available: 1, isActive: true };

function AmenityDialog({
	open,
	onOpenChange,
	hospitalId,
	amenity,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	hospitalId: number;
	amenity: HospitalAmenity | null;
	onSaved: () => void;
}) {
	const form = useForm<AmenityInput>({ resolver: zodResolver(schema), defaultValues: EMPTY });
	const { register, control, handleSubmit, reset, formState } = form;
	const { errors } = formState;

	useEffect(() => {
		if (!open) return;
		reset(
			amenity
				? {
						type: amenity.type,
						name: amenity.name,
						price: amenity.price,
						quantity: amenity.quantity,
						available: amenity.available,
						isActive: amenity.isActive,
				  }
				: EMPTY
		);
	}, [open, amenity, reset]);

	const save = useMutation({
		mutationFn: (data: AmenityInput) =>
			amenity ? updateAmenity(hospitalId, amenity.id, data) : createAmenity(hospitalId, data),
		onSuccess: () => {
			toast.success(amenity ? "Amenity updated" : "Amenity added");
			onSaved();
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !save.isPending && onOpenChange(o)}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{amenity ? "Edit amenity" : "Add amenity"}</DialogTitle>
					<DialogDescription>Beds, cabins, operation theatres and other facilities this hospital offers.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4" noValidate>
					<Field id="amenity-type" label="Type" required error={errors.type?.message}>
						<Controller
							control={control}
							name="type"
							render={({ field }) => (
								<OptionSelect
									id="amenity-type"
									value={field.value}
									onChange={field.onChange}
									invalid={!!errors.type}
									placeholder="Choose a type"
									options={(TYPES.includes(amenity?.type ?? "") || !amenity ? TYPES : [amenity.type, ...TYPES]).map((t) => ({
										value: t,
										label: label(t),
									}))}
								/>
							)}
						/>
					</Field>
					<Field id="amenity-name" label="Name" required error={errors.name?.message}>
						<Input id="amenity-name" {...register("name")} aria-invalid={!!errors.name} />
					</Field>
					<div className="grid gap-4 sm:grid-cols-3">
						<Field id="amenity-price" label="Price (৳)" error={errors.price?.message}>
							<Input id="amenity-price" type="number" min={0} {...register("price", { valueAsNumber: true })} aria-invalid={!!errors.price} />
						</Field>
						<Field id="amenity-quantity" label="Total" error={errors.quantity?.message}>
							<Input id="amenity-quantity" type="number" min={0} {...register("quantity", { valueAsNumber: true })} aria-invalid={!!errors.quantity} />
						</Field>
						<Field id="amenity-available" label="Available" error={errors.available?.message}>
							<Input id="amenity-available" type="number" min={0} {...register("available", { valueAsNumber: true })} aria-invalid={!!errors.available} />
						</Field>
					</div>
					<Controller
						control={control}
						name="isActive"
						render={({ field }) => (
							<label className="flex items-center gap-2 text-sm">
								<Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
								Show on the public listing
							</label>
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
							{save.isPending ? "Saving..." : amenity ? "Save changes" : "Add amenity"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function AmenitiesPanel({ hospitalId, amenities }: { hospitalId: number; amenities: HospitalAmenity[] }) {
	const queryClient = useQueryClient();
	const { hasPermission } = usePermissions();
	const [editing, setEditing] = useState<HospitalAmenity | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleting, setDeleting] = useState<HospitalAmenity | null>(null);
	const refresh = () => queryClient.invalidateQueries({ queryKey: ["hospital-details", hospitalId] });

	const remove = useMutation({
		mutationFn: (a: HospitalAmenity) => deleteAmenity(hospitalId, a.id),
		onSuccess: () => {
			toast.success("Amenity deleted");
			setDeleting(null);
			refresh();
		},
	});

	const canCreate = hasPermission("create-hospital-amenity");
	const canUpdate = hasPermission("update-hospital-amenity");
	const canDelete = hasPermission("delete-hospital-amenity");

	return (
		<>
			<ManageSection
				title="Amenities"
				count={amenities.length}
				icon={<Sparkles className="size-5" aria-hidden="true" />}
				addLabel="Add amenity"
				onAdd={
					canCreate
						? () => {
								setEditing(null);
								setDialogOpen(true);
						  }
						: undefined
				}
			>
				{amenities.length === 0 ? (
					<EmptyRow>No amenities yet.</EmptyRow>
				) : (
					<ul className="divide-y">
						{amenities.map((a) => (
							<li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
								<div className="min-w-0">
									<p className="font-medium">{a.name}</p>
									<p className="text-sm text-muted-foreground">
										{label(a.type)} · {a.available}/{a.quantity} available
										{a.price > 0 ? ` · ৳${a.price.toLocaleString()}` : ""}
									</p>
								</div>
								<div className="flex items-center gap-2">
									{!a.isActive && <Badge variant="outline">Hidden</Badge>}
									{canUpdate && (
										<Button
											size="icon"
											variant="ghost"
											aria-label={`Edit ${a.name}`}
											onClick={() => {
												setEditing(a);
												setDialogOpen(true);
											}}
										>
											<Pencil className="size-4" />
										</Button>
									)}
									{canDelete && (
										<Button size="icon" variant="ghost" aria-label={`Delete ${a.name}`} onClick={() => setDeleting(a)}>
											<Trash2 className="size-4 text-destructive" />
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</ManageSection>
			<AmenityDialog open={dialogOpen} onOpenChange={setDialogOpen} hospitalId={hospitalId} amenity={editing} onSaved={refresh} />
			<ConfirmDeleteDialog
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete amenity"
				description={`Delete "${deleting?.name ?? ""}"? This cannot be undone.`}
				error={remove.isError ? (remove.error as Error).message : null}
				pending={remove.isPending}
				onConfirm={() => deleting && remove.mutate(deleting)}
			/>
		</>
	);
}
