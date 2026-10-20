"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stethoscope, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { addDoctorToHospital, removeDoctorFromHospital, searchDoctorsByName } from "@/api/hospital-management";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/admin/advertisements/confirm-delete-dialog";
import { Field, OptionSelect } from "@/components/admin/advertisements/form-fields";
import { usePermissions } from "@/hooks/use-permissions";
import { DoctorResponse } from "@/types/doctors";
import { EmptyRow, ManageSection } from "./manage-section";

function useDebounced<T>(value: T, ms: number) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), ms);
		return () => clearTimeout(id);
	}, [value, ms]);
	return debounced;
}

function AddDoctorDialog({
	open,
	onOpenChange,
	hospitalId,
	existingIds,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	hospitalId: number;
	existingIds: number[];
	onSaved: () => void;
}) {
	const [search, setSearch] = useState("");
	const [picked, setPicked] = useState<DoctorResponse | null>(null);
	const [speciality, setSpeciality] = useState("");
	const [position, setPosition] = useState("");
	const term = useDebounced(search.trim(), 300);

	useEffect(() => {
		if (open) {
			setSearch("");
			setPicked(null);
			setSpeciality("");
			setPosition("");
		}
	}, [open]);

	const results = useQuery({
		queryKey: ["doctor-search", term],
		queryFn: () => searchDoctorsByName(term),
		enabled: open && term.length >= 2,
	});
	const specialities = useQuery({
		queryKey: ["medical-specialities-all"],
		queryFn: fetchAllMedicalSpecialities,
		enabled: open,
		staleTime: 60 * 60 * 1000,
	});

	const save = useMutation({
		mutationFn: () =>
			addDoctorToHospital(picked!.id, {
				hospitalId,
				medicalSpecialityId: speciality ? Number(speciality) : undefined,
				doctorPosition: position.trim() || undefined,
			}),
		onSuccess: () => {
			toast.success("Doctor added to this hospital");
			onSaved();
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !save.isPending && onOpenChange(o)}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Add doctor</DialogTitle>
					<DialogDescription>Search an existing doctor by name and link them to this hospital.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					{picked ? (
						<div className="flex items-center justify-between rounded-md border p-3">
							<div>
								<p className="font-medium">{picked.profile?.name}</p>
								<p className="text-sm text-muted-foreground">BMDC {picked.bmdcNo}</p>
							</div>
							<Button size="sm" variant="ghost" onClick={() => setPicked(null)}>
								Change
							</Button>
						</div>
					) : (
						<Field id="doctor-search" label="Doctor name" hint="Type at least 2 letters">
							<Input id="doctor-search" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
							{term.length >= 2 && (
								<ul className="mt-2 max-h-52 divide-y overflow-auto rounded-md border" aria-label="Matching doctors">
									{results.isLoading && <li className="p-3 text-sm text-muted-foreground">Searching...</li>}
									{results.data?.length === 0 && <li className="p-3 text-sm text-muted-foreground">No doctor found.</li>}
									{results.data?.map((d) => {
										const already = existingIds.includes(d.id);
										return (
											<li key={d.id}>
												<button
													type="button"
													disabled={already}
													onClick={() => setPicked(d)}
													className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
												>
													<span className="font-medium">{d.profile?.name}</span>
													<span className="text-muted-foreground">
														BMDC {d.bmdcNo}
														{already ? " · already here" : ""}
													</span>
												</button>
											</li>
										);
									})}
								</ul>
							)}
						</Field>
					)}
					<Field id="doctor-speciality" label="Speciality" hint="Optional">
						<OptionSelect
							id="doctor-speciality"
							value={speciality}
							onChange={setSpeciality}
							optional
							placeholder={specialities.isLoading ? "Loading..." : "Choose a speciality"}
							options={(specialities.data ?? []).map((s) => ({ value: String(s.id), label: s.name }))}
						/>
					</Field>
					<Field id="doctor-position" label="Position" hint="Optional, for example Consultant">
						<Input id="doctor-position" value={position} maxLength={100} onChange={(e) => setPosition(e.target.value)} />
					</Field>
					{save.isError && (
						<p role="alert" className="text-sm text-destructive">
							{(save.error as Error).message}
						</p>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={save.isPending}>
						Cancel
					</Button>
					<Button onClick={() => save.mutate()} disabled={!picked || save.isPending}>
						{save.isPending ? "Adding..." : "Add doctor"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DoctorsPanel({ hospitalId, doctors }: { hospitalId: number; doctors: DoctorResponse[] }) {
	const queryClient = useQueryClient();
	const { hasPermission } = usePermissions();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [removing, setRemoving] = useState<DoctorResponse | null>(null);
	const refresh = () => queryClient.invalidateQueries({ queryKey: ["hospital-details", hospitalId] });
	const canEdit = hasPermission("update-hospital");

	const remove = useMutation({
		mutationFn: (d: DoctorResponse) => removeDoctorFromHospital(d.id, hospitalId),
		onSuccess: () => {
			toast.success("Doctor removed from this hospital");
			setRemoving(null);
			refresh();
		},
	});

	return (
		<>
			<ManageSection
				title="Doctors"
				count={doctors.length}
				icon={<Stethoscope className="size-5" aria-hidden="true" />}
				addLabel="Add doctor"
				onAdd={canEdit ? () => setDialogOpen(true) : undefined}
			>
				{doctors.length === 0 ? (
					<EmptyRow>No doctors linked yet.</EmptyRow>
				) : (
					<ul className="divide-y">
						{doctors.map((d) => (
							<li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
								<div className="min-w-0">
									<Link href={`/admin/doctors/${d.id}/view`} className="font-medium text-primary hover:underline">
										{d.profile?.name}
									</Link>
									<p className="text-sm text-muted-foreground">
										BMDC {d.bmdcNo}
										{d.specializations ? ` · ${d.specializations}` : ""}
									</p>
								</div>
								{canEdit && (
									<Button size="icon" variant="ghost" aria-label={`Remove ${d.profile?.name} from this hospital`} onClick={() => setRemoving(d)}>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								)}
							</li>
						))}
					</ul>
				)}
			</ManageSection>
			<AddDoctorDialog open={dialogOpen} onOpenChange={setDialogOpen} hospitalId={hospitalId} existingIds={doctors.map((d) => d.id)} onSaved={refresh} />
			<ConfirmDeleteDialog
				open={!!removing}
				onOpenChange={(o) => !o && setRemoving(null)}
				title="Remove doctor"
				description={`Unlink ${removing?.profile?.name ?? "this doctor"} from this hospital? The doctor's profile is kept.`}
				error={remove.isError ? (remove.error as Error).message : null}
				pending={remove.isPending}
				onConfirm={() => removing && remove.mutate(removing)}
			/>
		</>
	);
}
