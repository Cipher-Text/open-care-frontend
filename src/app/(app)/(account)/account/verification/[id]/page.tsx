"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/api/files";
import { fetchMyVerification, submitVerification, withdrawVerification } from "@/api/verification";
import { dateTime, VerificationStatusBadge } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { DocumentType } from "@/types/file";

const MAX_DOCUMENTS = 6;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

/** One verification request of the signed-in person: add documents while it is a draft, submit it, or withdraw it. */
export default function VerificationCasePage() {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const fileInput = useRef<HTMLInputElement>(null);
	const [note, setNote] = useState("");
	const [uploading, setUploading] = useState(false);
	const { data, isLoading, isError, error } = useQuery({ queryKey: ["my-verification", id], queryFn: () => fetchMyVerification(id), retry: false });

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["my-verification", id] });
		queryClient.invalidateQueries({ queryKey: ["my-verifications"] });
	};
	const failed = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
	const submit = useMutation({ mutationFn: () => submitVerification(id, note), onSuccess: () => { toast.success("Submitted. Staff will review it."); refresh(); }, onError: failed });
	const withdraw = useMutation({ mutationFn: () => withdrawVerification(id), onSuccess: () => { toast.success("Request withdrawn"); refresh(); }, onError: failed });

	const upload = async (file: File | undefined) => {
		if (!file || !data) return;
		setUploading(true);
		try {
			await uploadFile(DocumentType.VERIFICATION_DOCUMENT, data.id, file);
			toast.success("Document added");
			refresh();
		} catch (e) {
			failed(e);
		} finally {
			setUploading(false);
			if (fileInput.current) fileInput.current.value = "";
		}
	};

	const isDoctor = data?.subjectType === "DOCTOR";
	return (
		<div className="space-y-4 p-4 md:p-8">
			<Button variant="ghost" asChild>
				<Link href="/account/verification">
					<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
					All requests
				</Link>
			</Button>
			{isLoading && <Skeleton className="h-64 w-full" />}
			{isError && (
				<Alert variant="destructive">
					<AlertDescription>{error instanceof Error ? error.message : "Could not load the request"}</AlertDescription>
				</Alert>
			)}
			{data && (
				<Card>
					<CardHeader>
						<CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
							<span>
								{isDoctor ? "Doctor profile" : "Facility claim"}: {data.subjectName ?? `#${data.subjectId}`}
							</span>
							<VerificationStatusBadge status={data.status} />
						</CardTitle>
						<CardDescription>
							{data.claimedRegistrationNo ? `${isDoctor ? "BMDC number" : "Registration number"}: ${data.claimedRegistrationNo}` : "No registration number is recorded for this " + (isDoctor ? "doctor" : "facility") + " yet."}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						{data.status === "DRAFT" && (
							<>
								<p>
									Add a clear copy of {isDoctor ? "your BMDC registration certificate (and licence, if you have one)" : "the facility's registration certificate or licence"}. JPG, PNG, WebP or PDF,
									images up to 5 MB and PDF up to 10 MB, at most {MAX_DOCUMENTS} files. Only Open Care staff who review verification can open them.
								</p>
								<div className="flex flex-wrap items-center gap-3">
									<input ref={fileInput} type="file" accept={ACCEPT} className="hidden" id="verification-file" onChange={(e) => upload(e.target.files?.[0])} />
									<Button variant="outline" disabled={uploading || data.documents.length >= MAX_DOCUMENTS} onClick={() => fileInput.current?.click()}>
										{uploading ? "Uploading..." : "Add a document"}
									</Button>
									<span className="flex items-center gap-1.5 text-muted-foreground">
										<FileText className="size-4" aria-hidden="true" />
										{data.documents.length} added
									</span>
								</div>
								<div className="space-y-1">
									<Label htmlFor="verification-note">Note for the reviewer (optional)</Label>
									<Textarea id="verification-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} />
								</div>
								<div className="flex flex-wrap gap-2">
									<Button onClick={() => submit.mutate()} disabled={submit.isPending || data.documents.length === 0}>
										{submit.isPending ? "Submitting..." : "Submit for review"}
									</Button>
									<Button variant="ghost" onClick={() => withdraw.mutate()} disabled={withdraw.isPending}>
										Cancel this request
									</Button>
								</div>
							</>
						)}
						{(data.status === "PENDING" || data.status === "UNDER_REVIEW") && (
							<>
								<p>Submitted {dateTime(data.submittedAt)}. {data.documents.length} document(s) sent. You will see the decision here.</p>
								{data.status === "PENDING" && (
									<Button variant="outline" onClick={() => withdraw.mutate()} disabled={withdraw.isPending}>
										Withdraw the request
									</Button>
								)}
							</>
						)}
						{data.status === "VERIFIED" && <p>Verified on {dateTime(data.reviewedAt)}. The verified badge is shown on the public page.</p>}
						{(data.status === "REJECTED" || data.status === "REVOKED") && (
							<>
								<Alert>
									<AlertDescription>
										{data.status === "REJECTED" ? "Not approved" : "Verification withdrawn"} on {dateTime(data.reviewedAt)}. Reason: {data.decisionReason ?? "none given"}.
									</AlertDescription>
								</Alert>
								<p>You can fix what the reason names and start a new request from the Verification page.</p>
							</>
						)}
						{data.status === "WITHDRAWN" && <p>You withdrew this request.</p>}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
