"use client";

import { useState } from "react";
import { qk } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveConfirmedSuggestions, decideSuggestion, fetchSuggestions, type SuggestionConfidence, type SuggestionStatus } from "@/api/location-suggestions";
import { fetchDistricts } from "@/api/locations";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<SuggestionStatus, string> = {
	PENDING: "Waiting for you",
	APPROVED: "Approved",
	REJECTED: "Refused",
	SUPERSEDED: "Hospital already had a place",
};

/**
 * Proposed upazilas and thanas for hospitals that have none, read from the DGHS registry. Nothing changes on a hospital until
 * someone approves; a place a hospital already has is never overwritten. "Address confirmed" means the address names the place as
 * well as the registry; the others rest on the registry alone, so read the address before approving.
 */
export default function LocationReviewPage() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<SuggestionStatus>("PENDING");
	const [confidence, setConfidence] = useState<SuggestionConfidence | "">("");
	const [districtId, setDistrictId] = useState("");
	const [page, setPage] = useState(1);

	const districts = useQuery({ queryKey: [...qk.districts], queryFn: fetchDistricts, staleTime: 3_600_000 });
	const list = useQuery({
		queryKey: [...qk.locationSuggestions, status, confidence, districtId, page],
		queryFn: () => fetchSuggestions({ status, confidence, districtId, page, size: PAGE_SIZE }),
		retry: false,
		placeholderData: (previous) => previous,
	});

	const refresh = () => void queryClient.invalidateQueries({ queryKey: [...qk.locationSuggestions] });
	const decide = useMutation({
		mutationFn: ({ id, approve }: { id: number; approve: boolean }) => decideSuggestion(id, approve),
		onSuccess: (result) => {
			if (result.status === "SUPERSEDED") toast.message("That hospital already has a place, so nothing was changed");
			else toast.success(result.status === "APPROVED" ? "Place given to the hospital" : "Suggestion refused");
			refresh();
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Could not save");
			refresh();
		},
	});
	const approveAll = useMutation({
		mutationFn: approveConfirmedSuggestions,
		onSuccess: (result) => {
			toast.success(`${result.approved} approved${result.superseded ? `, ${result.superseded} skipped (already had a place)` : ""}. ${result.stillPending} still waiting.`);
			refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not approve"),
	});

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;
	const pending = status === "PENDING";

	return (
		<div className="flex flex-col">
			<AdminHeader title="Location review" description="Proposed upazilas and thanas for hospitals that have none" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<Alert>
					<AlertDescription>
						These places were read from the DGHS facility registry. Nothing is applied until you approve it, and a hospital that already has a place is never changed. &quot;Address confirmed&quot; means the address names the place too; for the others only the registry says so, so check the address first.
					</AlertDescription>
				</Alert>
				<div className="flex flex-wrap items-center gap-2">
					<div className="w-full sm:w-56">
						<NativeSelect aria-label="State" value={status} onChange={(e) => { setStatus(e.target.value as SuggestionStatus); setPage(1); }}>
							{(Object.keys(STATUS_LABEL) as SuggestionStatus[]).map((s) => (
								<option key={s} value={s}>{STATUS_LABEL[s]}</option>
							))}
						</NativeSelect>
					</div>
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="Evidence" value={confidence} onChange={(e) => { setConfidence(e.target.value as SuggestionConfidence | ""); setPage(1); }}>
							<option value="">Any evidence</option>
							<option value="CORROBORATED">Address confirmed</option>
							<option value="REGISTRY_ONLY">Registry only</option>
						</NativeSelect>
					</div>
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="District" value={districtId} onChange={(e) => { setDistrictId(e.target.value); setPage(1); }}>
							<option value="">All districts</option>
							{(districts.data ?? []).map((d) => (
								<option key={d.id} value={String(d.id)}>{d.name}</option>
							))}
						</NativeSelect>
					</div>
					{pending && (
						<Button
							className="sm:ml-auto"
							variant="outline"
							disabled={approveAll.isPending}
							onClick={() => {
								if (window.confirm("Approve every waiting suggestion that the address confirmed (up to 500 at a time)?")) approveAll.mutate();
							}}
						>
							Approve all address-confirmed
						</Button>
					)}
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the suggestions"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Hospital</TableHead>
										<TableHead>Address in the registry</TableHead>
										<TableHead>Proposed place</TableHead>
										<TableHead>Evidence</TableHead>
										<TableHead />
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((s) => (
										<TableRow key={s.id}>
											<TableCell className="max-w-xs">
												<p className="font-medium">{s.hospitalName}</p>
												<p className="text-xs text-muted-foreground">{s.districtName ?? "-"}{s.currentPlace ? ` · now: ${s.currentPlace}` : ""}</p>
											</TableCell>
											<TableCell className="max-w-sm text-sm" title={s.address ?? ""}>
												{s.address || "-"}
												{s.registryField && <p className="text-xs text-muted-foreground">Registry upazila field: {s.registryField}</p>}
											</TableCell>
											<TableCell className="whitespace-nowrap">
												<span className="font-medium">{s.suggestedPlace}</span> <span className="text-xs text-muted-foreground">{s.suggestedType === "THANA" ? "thana" : "upazila"}</span>
											</TableCell>
											<TableCell>
												<Badge variant={s.confidence === "CORROBORATED" ? "default" : "secondary"} title={s.reason ?? ""}>
													{s.confidence === "CORROBORATED" ? "Address confirmed" : "Registry only"}
												</Badge>
											</TableCell>
											<TableCell className="whitespace-nowrap text-right">
												{s.status === "PENDING" ? (
													<div className="flex justify-end gap-2">
														<Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ id: s.id, approve: true })}>Approve</Button>
														<Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: s.id, approve: false })}>Refuse</Button>
													</div>
												) : (
													<span className="text-xs text-muted-foreground">{STATUS_LABEL[s.status]}{s.decidedAt ? `, ${dateTime(s.decidedAt)}` : ""}</span>
												)}
											</TableCell>
										</TableRow>
									))}
									{rows.length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">Nothing in this list.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{totalPages > 1 && (
							<div className="mt-4 flex items-center justify-between text-sm">
								<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
								<span className="text-muted-foreground">Page {page} of {totalPages}</span>
								<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
