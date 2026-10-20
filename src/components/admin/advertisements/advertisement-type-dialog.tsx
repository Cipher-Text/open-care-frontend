"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createAdvertisementType,
	getAdvertisementPositions,
	updateAdvertisementType,
} from "@/api/advertisements";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	AdvertisementTypeFormData,
	advertisementTypeSchema,
} from "@/validations/advertisement-schema";
import { AdvertisementType } from "@/types/advertisements";
import { Field, OptionSelect } from "./form-fields";

const EMPTY: AdvertisementTypeFormData = {
	name: "",
	description: "",
	position: "",
	basePrice: 0,
	durationInDays: 30,
};

export function AdvertisementTypeDialog({
	open,
	onOpenChange,
	type,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Present when editing; omitted when creating. */
	type?: AdvertisementType | null;
	onSaved: () => void;
}) {
	const editing = !!type;
	const positions = useQuery({
		queryKey: ["advertisement-positions"],
		queryFn: getAdvertisementPositions,
		enabled: open,
	});

	const form = useForm<AdvertisementTypeFormData>({
		resolver: zodResolver(advertisementTypeSchema),
		defaultValues: EMPTY,
	});
	const { register, control, handleSubmit, reset, formState } = form;
	const { errors } = formState;

	// Load the row into the form each time the dialog opens
	useEffect(() => {
		if (!open) return;
		reset(
			type
				? {
						name: type.name,
						description: type.description,
						position: type.position?.value ?? "",
						basePrice: type.basePrice,
						durationInDays: type.durationInDays,
				  }
				: EMPTY
		);
	}, [open, type, reset]);

	const save = useMutation({
		mutationFn: (data: AdvertisementTypeFormData) =>
			type ? updateAdvertisementType(type.id, data) : createAdvertisementType(data),
		onSuccess: () => {
			toast.success(editing ? "Advertisement type updated" : "Advertisement type created");
			onSaved();
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !save.isPending && onOpenChange(o)}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{editing ? "Edit advertisement type" : "New advertisement type"}</DialogTitle>
					<DialogDescription>
						A type decides where an advertisement appears, its base price and how long it runs.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4" noValidate>
					<Field id="type-name" label="Name" required error={errors.name?.message}>
						<Input id="type-name" {...register("name")} aria-invalid={!!errors.name} />
					</Field>

					<Field id="type-description" label="Description" required error={errors.description?.message}>
						<Textarea id="type-description" rows={2} {...register("description")} aria-invalid={!!errors.description} />
					</Field>

					<Field id="type-position" label="Position" required error={errors.position?.message}>
						<Controller
							control={control}
							name="position"
							render={({ field }) => (
								<OptionSelect
									id="type-position"
									value={field.value}
									onChange={field.onChange}
									invalid={!!errors.position}
									placeholder={positions.isLoading ? "Loading..." : "Choose a position"}
									options={(positions.data ?? []).map((p) => ({ value: p.value, label: p.position }))}
								/>
							)}
						/>
					</Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field id="type-price" label="Base price (৳)" required error={errors.basePrice?.message}>
							<Input
								id="type-price"
								type="number"
								min={0}
								step="0.01"
								{...register("basePrice", { valueAsNumber: true })}
								aria-invalid={!!errors.basePrice}
							/>
						</Field>
						<Field id="type-days" label="Duration (days)" required error={errors.durationInDays?.message}>
							<Input
								id="type-days"
								type="number"
								min={1}
								max={3650}
								{...register("durationInDays", { valueAsNumber: true })}
								aria-invalid={!!errors.durationInDays}
							/>
						</Field>
					</div>

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
							{save.isPending ? "Saving..." : editing ? "Save changes" : "Create type"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
