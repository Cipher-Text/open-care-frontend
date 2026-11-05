"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { approveContribution, fetchContributionDetail, rejectContribution } from "@/api/contributions";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { KIND_WORDS, STATUS_WORDS } from "@/lib/contribution-kind";
import { qk } from "@/lib/query-keys";

/** Words for the fields people can send, so the page shows "BMDC number" and not "bmdcNo". */
const FIELD_LABELS: Record<string, string> = {
	name: "Name", bnName: "Name in Bangla", gender: "Gender", bmdcNo: "BMDC number", bnmcNo: "BNMC number", specializations: "Speciality",
	degrees: "Degrees", description: "About", phone: "Phone", address: "Address", districtId: "District id", upazilaId: "Upazila id",
	hospitalType: "Type", organizationType: "Run by", numberOfBed: "Beds", email: "Email", websiteUrl: "Website", lat: "Latitude", lon: "Longitude",
	registrationCode: "Registration code", title: "Title", summary: "Summary", bodyHtml: "Article (HTML as sent)", language: "Language", topics: "Topics",
	hospitalMedicalTestId: "Hospital test id", accepts: "Doctor accepts the test", comment: "Review", campDate: "Date of the camp", place: "Place",
	patientsServed: "Patients served", consultationDate: "Date", vehicleNumber: "Vehicle number", type: "Type", driverName: "Driver", driverPhone: "Driver's phone", hospitalId: "Facility id",
};

/** One proposal: what was sent, who sent it, and the decision. Approving creates the record (not verified) and awards the points. */
export default function ContributionReviewPage() {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [reason, setReason] = useState("");
	const [notDuplicate, setNotDuplicate] = useState(false);
	const { data, isLoading, isError, error } = useQuery({ queryKey: [...qk.contributionDetail, id], queryFn: () => fetchContributionDetail(id), retry: false });

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: [...qk.contributionDetail, id] });
		queryClient.invalidateQueries({ queryKey: [...qk.contributionQueue] });
	};
	const failed = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
	const approve = useMutation({ mutationFn: () => approveContribution(id, notDuplicate), onSuccess: () => { toast.success("Approved: the record is listed and the person earned the points"); refresh(); }, onError: failed });
	const reject = useMutation({ mutationFn: () => rejectContribution(id, reason.trim()), onSuccess: () => { toast.success("Not accepted: the person will see the reason"); setReason(""); refresh(); }, onError: failed });

	const waiting = data?.status === "PENDING";
	const busy = approve.isPending || reject.isPending;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Proposal" description={data ? `${KIND_WORDS[data.kind].label}: ${data.subjectName ?? data.id}` : undefined}>
				<Button variant="ghost" asChild>
					<Link href="/admin/contributions">
						<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
						All proposals
					</Link>
				</Button>
			</AdminHeader>
			<div className="space-y-4 p-4 pt-6 md:p-8">
				{isLoading && <Skeleton className="h-64 w-full" />}
				{isError && (
					<Alert variant="destructive">
						<AlertDescription>{error instanceof Error ? error.message : "Could not load the proposal"}</AlertDescription>
					</Alert>
				)}
				{data && (
					<>
						<Card>
							<CardHeader>
								<CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
									<span>{KIND_WORDS[data.kind].label}</span>
									<Badge variant={data.status === "APPROVED" ? "default" : data.status === "REJECTED" ? "destructive" : "secondary"}>{STATUS_WORDS[data.status]}</Badge>
								</CardTitle>
								<CardDescription>
									Sent by {data.contributorName ?? `profile ${data.contributorProfileId}`} on {dateTime(data.submittedAt)}.
									{data.reviewer ? ` Decided by ${data.reviewer} on ${dateTime(data.reviewedAt)}.` : ""}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
									{Object.entries(data.data ?? {}).filter(([, v]) => v !== null && v !== "").map(([k, v]) => (
										<div key={k}>
											<dt className="text-muted-foreground">{FIELD_LABELS[k] ?? k}</dt>
											<dd className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-medium">{typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}</dd>
										</div>
									))}
								</dl>
								{data.note && <p><span className="font-medium">Note from the person: </span>{data.note}</p>}
								{data.status === "APPROVED" && (
									<p>
										{data.createdSubjectId != null ? `Recorded as #${data.createdSubjectId}. ` : ""}The person earned {data.pointsAwarded} points.
										{["DOCTOR", "NURSE", "HOSPITAL", "AMBULANCE"].includes(data.kind) ? " The listing is not verified: its owner can claim it." : ""}
									</p>
								)}
								{data.status === "REJECTED" && data.decisionReason && <p><span className="font-medium">Reason: </span>{data.decisionReason}</p>}
							</CardContent>
						</Card>

						{waiting && (
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Decision</CardTitle>
									<CardDescription>Check that it is real and not already listed (search the directory) before you approve.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									{data.kind === "HOSPITAL" && (
										<div className="flex items-center gap-2">
											<Checkbox id="not-duplicate" checked={notDuplicate} onCheckedChange={(v) => setNotDuplicate(v === true)} />
											<Label htmlFor="not-duplicate">I looked: this is not the same as a facility already listed</Label>
										</div>
									)}
									<div className="space-y-1">
										<Label htmlFor="reason">Reason (required to reject; the person sees it)</Label>
										<Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={1000} />
									</div>
									<div className="flex flex-wrap gap-2">
										<Button onClick={() => approve.mutate()} disabled={busy}>{KIND_WORDS[data.kind].track === "DOCTOR" ? "Approve" : "Approve and list"}</Button>
										<Button variant="destructive" onClick={() => reject.mutate()} disabled={busy || !reason.trim()}>Reject</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</>
				)}
			</div>
		</div>
	);
}
