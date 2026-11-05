"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addHospitalStaff, endStaffWorkplace, fetchHospitalStaff, KIND_LABEL, searchPeople, type StaffWorkplace } from "@/api/staff-workplaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

/**
 * The nurses and nutritionists who work at a hospital, for the people who administer it: who they are, how to reach them, and a way to
 * add or end a link. (The server shows this only to the hospital's administrators and platform staff.)
 */
export function HospitalStaffCard({ hospitalId }: { hospitalId: number }) {
	const queryClient = useQueryClient();
	const key = ["hospital-staff", hospitalId];
	const staff = useQuery({ queryKey: key, queryFn: () => fetchHospitalStaff(hospitalId), retry: false });

	const [kind, setKind] = useState<StaffWorkplace["kind"]>("NURSE");
	const [text, setText] = useState("");
	const [personId, setPersonId] = useState("");
	const [position, setPosition] = useState("");

	const found = useQuery({ queryKey: ["staff-search", kind, text], queryFn: () => searchPeople(kind, text), enabled: text.trim().length >= 2, staleTime: 30_000 });

	const add = useMutation({
		mutationFn: () => addHospitalStaff(hospitalId, { kind, personId: Number(personId), position }),
		onSuccess: () => {
			toast.success("Added");
			setText("");
			setPersonId("");
			setPosition("");
			queryClient.invalidateQueries({ queryKey: key });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not add the person"),
	});
	const end = useMutation({
		mutationFn: (id: number) => endStaffWorkplace(id),
		onSuccess: () => {
			toast.success("Link ended");
			queryClient.invalidateQueries({ queryKey: key });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not end the link"),
	});

	return (
		<Card className="max-w-3xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Stethoscope className="size-5 text-primary" aria-hidden="true" />
					Nurses and nutritionists here
				</CardTitle>
				<CardDescription>The people who work at this hospital. Only its administrators see this list and its contact details.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{staff.isLoading ? (
					<p className="text-sm text-muted-foreground">Loading</p>
				) : staff.isError ? (
					<p role="alert" className="text-sm text-destructive">The staff could not be loaded.</p>
				) : staff.data && staff.data.length > 0 ? (
					<ul className="divide-y rounded-md border">
						{staff.data.map((w) => (
							<li key={w.id} className="flex flex-wrap items-start justify-between gap-2 p-3">
								<div className="min-w-0 text-sm">
									<p className="font-medium">
										{w.name ?? "Unnamed"} <Badge variant="secondary">{KIND_LABEL[w.kind]}</Badge>
										{w.verified ? <Badge className="ml-1">Verified</Badge> : null}
									</p>
									<p className="text-xs text-muted-foreground">
										{[w.position, w.registrationNo, w.phone, w.email].filter(Boolean).join(", ") || "No details"}
										{`, since ${w.startDate}`}
									</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label={`End the link of ${w.name ?? "this person"}`}
									disabled={end.isPending}
									onClick={() => {
										if (window.confirm(`End ${w.name ?? "this person"}'s link to this hospital?`)) end.mutate(w.id);
									}}
								>
									<Trash2 className="size-4" aria-hidden="true" />
								</Button>
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-muted-foreground">No nurses or nutritionists are linked to this hospital yet.</p>
				)}

				<form
					className="space-y-3 rounded-md border border-dashed p-3"
					onSubmit={(event) => {
						event.preventDefault();
						if (personId) add.mutate();
					}}
				>
					<p className="text-sm font-medium">Add someone</p>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-1">
							<Label htmlFor="staff-kind">Who</Label>
							<NativeSelect id="staff-kind" value={kind} onChange={(e) => { setKind(e.target.value as StaffWorkplace["kind"]); setPersonId(""); }}>
								<option value="NURSE">A nurse</option>
								<option value="NUTRITIONIST">A nutritionist</option>
							</NativeSelect>
						</div>
						<div className="space-y-1">
							<Label htmlFor="staff-position">Position (optional)</Label>
							<Input id="staff-position" value={position} placeholder="For example Ward nurse" onChange={(e) => setPosition(e.target.value)} />
						</div>
					</div>
					<div className="space-y-1">
						<Label htmlFor="staff-search">Name</Label>
						<Input id="staff-search" value={text} placeholder="Type at least 2 letters of the name" onChange={(e) => { setText(e.target.value); setPersonId(""); }} />
						{text.trim().length >= 2 && (
							<NativeSelect aria-label="Matching people" value={personId} onChange={(e) => setPersonId(e.target.value)}>
								<option value="">{found.isLoading ? "Searching" : found.data && found.data.length > 0 ? "Choose one" : "No match: they must be listed first"}</option>
								{found.data?.map((p) => (
									<option key={p.id} value={p.id}>{p.name}{p.detail ? ` (${p.detail})` : ""}</option>
								))}
							</NativeSelect>
						)}
					</div>
					<Button type="submit" disabled={!personId || add.isPending}>
						<Plus className="mr-2 size-4" aria-hidden="true" />
						{add.isPending ? "Adding" : "Add"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
