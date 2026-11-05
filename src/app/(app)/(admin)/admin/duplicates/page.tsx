"use client";

import Link from "next/link";
import { qk } from "@/lib/query-keys";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkDuplicates, deleteDuplicate, fetchDuplicateGroups, type DuplicateCandidate, type DuplicateKind } from "@/api/duplicates";
import { fetchDistricts } from "@/api/locations";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { canCheck, recordHref, REASON_LABEL, sortCandidates } from "@/lib/duplicate-view";
import { usePermissions } from "@/hooks/use-permissions";

const KIND_LABEL: Record<DuplicateKind, string> = { HOSPITAL: "Hospitals", DOCTOR: "Doctors", NURSE: "Nurses", NUTRITIONIST: "Nutritionists", AMBULANCE: "Ambulances" };
const KIND_PERMISSIONS: Record<DuplicateKind, string[]> = {
	HOSPITAL: ["create-hospital", "delete-hospital"],
	DOCTOR: ["create-doctor", "delete-doctor", "verify-doctor"],
	NURSE: ["create-nurse", "delete-nurse"],
	NUTRITIONIST: ["create-nutritionist", "delete-nutritionist"],
	AMBULANCE: ["create-ambulance", "delete-ambulance"],
};
const NUMBER_LABEL: Record<DuplicateKind, string> = { HOSPITAL: "Registration code", DOCTOR: "BMDC number", NURSE: "BNMC number", NUTRITIONIST: "Registration number", AMBULANCE: "Vehicle number" };

const DELETE_PERMISSION: Record<DuplicateKind, string> = { HOSPITAL: "delete-hospital", DOCTOR: "delete-doctor", NURSE: "delete-nurse", NUTRITIONIST: "delete-nutritionist", AMBULANCE: "delete-ambulance" };

/**
 * The records that may be the same one. Staff who hold the delete permission can delete one after looking at both: the server only
 * allows it when another record has the same name or number and nothing else uses this one, and says what does if it refuses.
 */
function CandidateTable({ rows }: { rows: DuplicateCandidate[] }) {
	const { hasPermission } = usePermissions();
	const queryClient = useQueryClient();
	const remove = useMutation({
		mutationFn: (c: DuplicateCandidate) => deleteDuplicate(c.type, c.id),
		onSuccess: (kept, c) => {
			toast.success(`Deleted ${c.name || `record ${c.id}`}. The other one (${kept.name || `record ${kept.id}`}) stays.`);
			void queryClient.invalidateQueries({ queryKey: [...qk.duplicatesCheck] });
			void queryClient.invalidateQueries({ queryKey: [...qk.duplicateGroups] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete the record"),
	});
	const confirmDelete = (c: DuplicateCandidate) => {
		const label = `${c.name || `record ${c.id}`} (ID ${c.id}${c.place ? `, ${c.place}` : ""})`;
		if (window.confirm(`Delete ${label}?\n\nOnly do this after checking that it is the same as the other record. It cannot be undone.`)) remove.mutate(c);
	};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Place or contact</TableHead>
					<TableHead>Number</TableHead>
					<TableHead>Why it matches</TableHead>
					<TableHead>State</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((c) => (
					<TableRow key={`${c.reason}-${c.id}`}>
						<TableCell>
							<Link href={recordHref(c.type, c.id)} className="font-medium underline">{c.name || `Record ${c.id}`}</Link>
							{c.bnName && <p className="text-xs text-muted-foreground">{c.bnName}</p>}
						</TableCell>
						<TableCell className="text-sm">{c.place ?? "-"}</TableCell>
						<TableCell className="whitespace-nowrap text-sm">{c.key ?? "-"}</TableCell>
						<TableCell>
							<Badge variant={REASON_LABEL[c.reason].strong ? "destructive" : "secondary"}>{REASON_LABEL[c.reason].label}</Badge>
							{c.score < 1 && <span className="ml-2 text-xs text-muted-foreground">{Math.round(c.score * 100)}%</span>}
						</TableCell>
						<TableCell className="space-x-1 whitespace-nowrap">
							{c.active === false && <Badge variant="outline">Inactive</Badge>}
							{c.verified && <Badge>Verified</Badge>}
						</TableCell>
						<TableCell className="text-right">
							{hasPermission(DELETE_PERMISSION[c.type]) && c.reason !== "SIMILAR_NAME" && c.reason !== "SAME_DIGITS" && (
								<Button size="sm" variant="outline" disabled={remove.isPending} onClick={() => confirmDelete(c)}>Delete</Button>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

/**
 * Finds records that may be the same one entered twice. "Look for a record" runs the same check the add forms run, by name or by
 * registration number; "Same names" lists the records that already share a name (or a number), biggest groups first. It only
 * looks: merging or deactivating a duplicate is done on the record itself.
 */
export default function DuplicatesPage() {
	const { hasPermission } = usePermissions();
	const kinds = (Object.keys(KIND_LABEL) as DuplicateKind[]).filter((k) => KIND_PERMISSIONS[k].some((p) => hasPermission(p)));
	const [tab, setTab] = useState<"check" | "groups">("check");
	const [kind, setKind] = useState<DuplicateKind | "">("");
	const type = (kind || kinds[0]) as DuplicateKind | undefined;

	const districts = useQuery({ queryKey: [...qk.districts], queryFn: fetchDistricts, staleTime: 3_600_000 });

	// look for a record
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [districtId, setDistrictId] = useState("");
	const [submitted, setSubmitted] = useState<{ type: DuplicateKind; name: string; number: string; districtId: string } | null>(null);
	const result = useQuery({
		queryKey: [...qk.duplicatesCheck, submitted],
		queryFn: () => checkDuplicates({ type: submitted!.type, name: submitted!.name, number: submitted!.number, districtId: submitted!.districtId }),
		enabled: submitted !== null,
		retry: false,
	});

	// same names
	const [by, setBy] = useState<"NAME" | "NUMBER">("NAME");
	const [groupDistrict, setGroupDistrict] = useState("");
	const [page, setPage] = useState(1);
	const groups = useQuery({
		queryKey: [...qk.duplicateGroups, type, by, groupDistrict, page],
		queryFn: () => fetchDuplicateGroups({ type: type!, by: type === "AMBULANCE" ? "NUMBER" : by, districtId: groupDistrict, page, size: 10 }),
		enabled: tab === "groups" && !!type,
		retry: false,
		placeholderData: (previous) => previous,
	});

	if (!type) {
		return (
			<div className="flex flex-col">
				<AdminHeader title="Duplicate check" description="Find records that may be entered twice" />
				<div className="p-4 md:p-8">
					<Alert>
						<AlertDescription>Your role does not include creating or deleting hospitals, doctors, nurses, nutritionists or ambulances.</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	const rows = result.data ? sortCandidates(result.data) : [];
	const totalPages = groups.data?.totalPages ?? 0;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Duplicate check" description="Find records that may be entered twice" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-48">
						<NativeSelect aria-label="Kind of record" value={type} onChange={(e) => { setKind(e.target.value as DuplicateKind); setPage(1); setSubmitted(null); }}>
							{kinds.map((k) => (
								<option key={k} value={k}>{KIND_LABEL[k]}</option>
							))}
						</NativeSelect>
					</div>
					<Button variant={tab === "check" ? "default" : "outline"} onClick={() => setTab("check")}>Look for a record</Button>
					<Button variant={tab === "groups" ? "default" : "outline"} onClick={() => setTab("groups")}>Same names</Button>
				</div>

				{tab === "check" ? (
					<Card>
						<CardContent className="space-y-4 pt-6">
							<p className="text-sm text-muted-foreground">
								Type a name (3 letters or more), a registration number, or both. Names are compared without capital letters, punctuation or titles like Dr., and close spellings are shown too. A number is compared without spaces or hyphens.
							</p>
							<form
								className="flex flex-wrap items-end gap-3"
								onSubmit={(e) => {
									e.preventDefault();
									if (canCheck(name, number)) setSubmitted({ type, name: name.trim(), number: number.trim(), districtId });
								}}
							>
								<div className="w-full sm:w-72">
									<label className="text-sm font-medium" htmlFor="dup-name">Name</label>
									<Input id="dup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="For example Labaid Limited" />
								</div>
								<div className="w-full sm:w-56">
									<label className="text-sm font-medium" htmlFor="dup-number">{NUMBER_LABEL[type]}</label>
									<Input id="dup-number" value={number} onChange={(e) => setNumber(e.target.value)} />
								</div>
								{type === "HOSPITAL" && (
									<div className="w-full sm:w-52">
										<label className="text-sm font-medium" htmlFor="dup-district">District</label>
										<NativeSelect id="dup-district" value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
											<option value="">Any district</option>
											{(districts.data ?? []).map((d) => (
												<option key={d.id} value={String(d.id)}>{d.name}</option>
											))}
										</NativeSelect>
									</div>
								)}
								<Button type="submit" disabled={!canCheck(name, number)}>Look</Button>
							</form>
							{submitted && (result.isLoading ? (
								<Skeleton className="h-24 w-full" />
							) : result.isError ? (
								<Alert variant="destructive">
									<AlertDescription>{result.error instanceof Error ? result.error.message : "Could not look for duplicates"}</AlertDescription>
								</Alert>
							) : rows.length === 0 ? (
								<p className="text-sm text-muted-foreground">Nothing like that was found.</p>
							) : (
								<CandidateTable rows={rows} />
							))}
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="space-y-4 pt-6">
							<div className="flex flex-wrap items-center gap-2">
								{(type === "DOCTOR" || type === "NURSE" || type === "NUTRITIONIST") && (
									<div className="w-full sm:w-52">
										<NativeSelect aria-label="Group by" value={by} onChange={(e) => { setBy(e.target.value as "NAME" | "NUMBER"); setPage(1); }}>
											<option value="NAME">Same name</option>
											<option value="NUMBER">Same {NUMBER_LABEL[type]}</option>
										</NativeSelect>
									</div>
								)}
								{type === "HOSPITAL" && (
									<div className="w-full sm:w-52">
										<NativeSelect aria-label="District" value={groupDistrict} onChange={(e) => { setGroupDistrict(e.target.value); setPage(1); }}>
											<option value="">All districts</option>
											{(districts.data ?? []).map((d) => (
												<option key={d.id} value={String(d.id)}>{d.name}</option>
											))}
										</NativeSelect>
									</div>
								)}
								{groups.data && <p className="text-sm text-muted-foreground">{groups.data.totalItems} groups. Same name does not always mean the same place: look at the address, type and number before treating two records as one.</p>}
							</div>
							{groups.isError ? (
								<Alert variant="destructive">
									<AlertDescription>{groups.error instanceof Error ? groups.error.message : "Could not load the groups"}</AlertDescription>
								</Alert>
							) : groups.isLoading ? (
								<Skeleton className="h-40 w-full" />
							) : (
								(groups.data?.content ?? []).map((g) => (
									<div key={`${g.label}-${g.members[0]?.id}`} className="rounded-md border p-3">
										<p className="mb-2 text-sm font-medium">{g.size} records: <span className="font-mono">{g.label}</span></p>
										<CandidateTable rows={g.members} />
										{g.members.length < g.size && <p className="mt-1 text-xs text-muted-foreground">Showing {g.members.length} of {g.size}.</p>}
									</div>
								))
							)}
							{totalPages > 1 && (
								<div className="flex items-center justify-between text-sm">
									<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
									<span className="text-muted-foreground">Page {page} of {totalPages}</span>
									<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
