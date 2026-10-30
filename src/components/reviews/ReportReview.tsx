"use client";

import { useState } from "react";
import { toast } from "sonner";
import { reportReview } from "@/api/reviews";
import { useAuth } from "@/contexts/auth-context";

const REASONS = [
	{ value: "ABUSIVE", label: "Abusive or offensive" },
	{ value: "WRONG_PERSON", label: "About the wrong person" },
	{ value: "PERSONAL_DETAILS", label: "Shows personal details" },
	{ value: "SPAM", label: "Spam or an advertisement" },
	{ value: "OTHER", label: "Something else" },
];

/** A small report form on a published review. A signed-in person only; others are pointed to sign in. */
export function ReportReview({ reviewId }: { reviewId: number }) {
	const { isAuthenticated } = useAuth();
	const [reason, setReason] = useState("ABUSIVE");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);

	if (sent) return <span className="text-xs text-muted-foreground">Thank you. A moderator will look at it.</span>;

	return (
		<details className="text-xs text-muted-foreground">
			<summary className="cursor-pointer hover:underline">Report this review</summary>
			{isAuthenticated ? (
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<select className="rounded-md border bg-background px-2 py-1" value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Reason">
						{REASONS.map((r) => (
							<option key={r.value} value={r.value}>{r.label}</option>
						))}
					</select>
					<button
						type="button"
						className="rounded-md border px-2 py-1 hover:bg-accent"
						disabled={busy}
						onClick={async () => {
							setBusy(true);
							try {
								await reportReview(reviewId, reason);
								setSent(true);
							} catch (error) {
								toast.error(error instanceof Error ? error.message : "Could not send your report");
								setBusy(false);
							}
						}}
					>
						Send report
					</button>
				</div>
			) : (
				<p className="mt-2">Sign in to report a review.</p>
			)}
		</details>
	);
}
