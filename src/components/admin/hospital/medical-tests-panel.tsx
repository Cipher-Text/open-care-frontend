"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlaskConical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { fetchMedicalTests } from "@/api/medical-tests";
import { createHospitalTest, deleteHospitalTest, HospitalTestInput, updateHospitalTest } from "@/api/hospital-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/admin/advertisements/confirm-delete-dialog";
import { Field, OptionSelect } from "@/components/admin/advertisements/form-fields";
import { usePermissions } from "@/hooks/use-permissions";
import { HospitalTest } from "@/types/hospitals";
import { EmptyRow, ManageSection } from "./manage-section";

const schema = z.object({
	medicalTestId: z.number({ message: "Choose a test" }).int().min(1, "Choose a test"),
	testCode: z.string().trim().max(50, "At most 50 characters").optional(),
	price: z.number({ message: "Enter a number" }).int("Whole taka only").min(0, "Cannot be negative"),
	processingTimeMinutes: z
		.number({ message: "Enter a number" })
		.int()
		.min(1, "Must be at least 1")
		.optional()
		.or(z.nan().transform(() => undefined)),
	isAvailable: z.boolean(),
	isActive: z.boolean(),
});

const EMPTY: HospitalTestInput = { medicalTestId: 0, testCode: "", price: 0, isAvailable: true, isActive: true };

function TestDialog({
	open,
	onOpenChange,
	hospitalId,
	test,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	hospitalId: number;
	test: HospitalTest | null;
	onSaved: () => void;
}) {
	const [search, setSearch] = useState("");
	const form = useForm<HospitalTestInput>({ resolver: zodResolver(schema), defaultValues: EMPTY });
	const { register, control, handleSubmit, reset, formState } = form;
	const { errors } = formState;

	const catalogue = useQuery({
		queryKey: ["medical-test-catalogue", search],
		queryFn: () => fetchMedicalTests({ page: 1, size: 30, name: search || undefined }),
		enabled: open && !test,
		staleTime: 60_000,
	});

	useEffect(() => {
		if (!open) return;
		setSearch("");
		reset(
			test
				? {
						medicalTestId: test.medicalTest?.id ?? 0,
						testCode: test.testCode ?? "",
						price: test.price,
						isAvailable: test.isAvailable,
						isActive: test.isActive,
				  }
				: EMPTY
		);
	}, [open, test, reset]);

	const save = useMutation({
		mutationFn: (data: HospitalTestInput) => {
			const body = { ...data, testCode: data.testCode?.trim() || undefined };
			return test ? updateHospitalTest(hospitalId, test.id, body) : createHospitalTest(hospitalId, body);
		},
		onSuccess: () => {
			toast.success(test ? "Test updated" : "Test added");
			onSaved();
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !save.isPending && onOpenChange(o)}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{test ? "Edit medical test" : "Add medical test"}</DialogTitle>
					<DialogDescription>
						Pick a test from the catalogue and set this hospital&apos;s price. A hospital can offer each test once.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4" noValidate>
					{test ? (
						<p className="text-sm">
							<span className="text-muted-foreground">Test: </span>
							<span className="font-medium">{test.medicalTest?.name ?? test.name}</span>
						</p>
					) : (
						<>
							<Field id="test-search" label="Find in catalogue">
								<Input id="test-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to search, for example CBC" />
							</Field>
							<Field id="test-pick" label="Test" required error={errors.medicalTestId?.message}>
								<Controller
									control={control}
									name="medicalTestId"
									render={({ field }) => (
										<OptionSelect
											id="test-pick"
											value={field.value ? String(field.value) : ""}
											onChange={(v) => field.onChange(v ? Number(v) : 0)}
											invalid={!!errors.medicalTestId}
											placeholder={catalogue.isLoading ? "Loading..." : "Choose a test"}
											options={(catalogue.data?.content ?? []).map((t) => ({ value: String(t.id), label: t.name }))}
										/>
									)}
								/>
							</Field>
						</>
					)}
					<div className="grid gap-4 sm:grid-cols-2">
						<Field id="test-price" label="Price (৳)" error={errors.price?.message}>
							<Input id="test-price" type="number" min={0} {...register("price", { valueAsNumber: true })} aria-invalid={!!errors.price} />
						</Field>
						<Field id="test-code" label="Test code" hint="Optional. Must be unique across all hospitals." error={errors.testCode?.message}>
							<Input id="test-code" {...register("testCode")} aria-invalid={!!errors.testCode} />
						</Field>
					</div>
					<Field id="test-minutes" label="Report time (minutes)" hint="Optional. Defaults to 120." error={errors.processingTimeMinutes?.message}>
						<Input id="test-minutes" type="number" min={1} {...register("processingTimeMinutes", { valueAsNumber: true })} />
					</Field>
					<div className="flex flex-wrap gap-6">
						<Controller
							control={control}
							name="isAvailable"
							render={({ field }) => (
								<label className="flex items-center gap-2 text-sm">
									<Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
									Currently available
								</label>
							)}
						/>
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
							{save.isPending ? "Saving..." : test ? "Save changes" : "Add test"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function MedicalTestsPanel({ hospitalId, tests }: { hospitalId: number; tests: HospitalTest[] }) {
	const queryClient = useQueryClient();
	const { hasPermission } = usePermissions();
	const [editing, setEditing] = useState<HospitalTest | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleting, setDeleting] = useState<HospitalTest | null>(null);
	const refresh = () => queryClient.invalidateQueries({ queryKey: ["hospital-details", hospitalId] });

	const remove = useMutation({
		mutationFn: (t: HospitalTest) => deleteHospitalTest(hospitalId, t.id),
		onSuccess: () => {
			toast.success("Test removed");
			setDeleting(null);
			refresh();
		},
	});

	const canCreate = hasPermission("create-hospital-medical-test");
	const canUpdate = hasPermission("update-hospital-medical-test");
	const canDelete = hasPermission("delete-hospital-medical-test");
	const nameOf = (t: HospitalTest) => t.medicalTest?.name || t.name;

	return (
		<>
			<ManageSection
				title="Medical tests"
				count={tests.length}
				icon={<FlaskConical className="size-5" aria-hidden="true" />}
				addLabel="Add test"
				onAdd={
					canCreate
						? () => {
								setEditing(null);
								setDialogOpen(true);
						  }
						: undefined
				}
			>
				{tests.length === 0 ? (
					<EmptyRow>No medical tests yet.</EmptyRow>
				) : (
					<ul className="divide-y">
						{tests.map((t) => (
							<li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
								<div className="min-w-0">
									<p className="font-medium">{nameOf(t)}</p>
									<p className="text-sm text-muted-foreground">
										{t.price > 0 ? `৳${t.price.toLocaleString()}` : "No price"}
										{t.testCode ? ` · ${t.testCode}` : ""}
									</p>
								</div>
								<div className="flex items-center gap-2">
									{!t.isAvailable && <Badge variant="outline">Unavailable</Badge>}
									{!t.isActive && <Badge variant="outline">Hidden</Badge>}
									{canUpdate && (
										<Button
											size="icon"
											variant="ghost"
											aria-label={`Edit ${nameOf(t)}`}
											onClick={() => {
												setEditing(t);
												setDialogOpen(true);
											}}
										>
											<Pencil className="size-4" />
										</Button>
									)}
									{canDelete && (
										<Button size="icon" variant="ghost" aria-label={`Remove ${nameOf(t)}`} onClick={() => setDeleting(t)}>
											<Trash2 className="size-4 text-destructive" />
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</ManageSection>
			<TestDialog open={dialogOpen} onOpenChange={setDialogOpen} hospitalId={hospitalId} test={editing} onSaved={refresh} />
			<ConfirmDeleteDialog
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Remove medical test"
				description={`Remove "${deleting ? nameOf(deleting) : ""}" from this hospital?`}
				error={remove.isError ? (remove.error as Error).message : null}
				pending={remove.isPending}
				onConfirm={() => deleting && remove.mutate(deleting)}
			/>
		</>
	);
}
