"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { reportReview } from "@/api/reviews";
import { useAuth } from "@/contexts/auth-context";

/** `label` is a key of reviews.* in the message files. */
const REASONS = [
	{ value: "ABUSIVE", label: "reasonAbusive" },
	{ value: "WRONG_PERSON", label: "reasonWrongPerson" },
	{ value: "PERSONAL_DETAILS", label: "reasonPersonalDetails" },
	{ value: "SPAM", label: "reasonSpam" },
	{ value: "OTHER", label: "reasonOther" },
];

/** A small report form on a published review. A signed-in person only; others are pointed to sign in. */
export function ReportReview({ reviewId }: { reviewId: number }) {
	const t = useTranslations("reviews");
	const { isAuthenticated } = useAuth();
	const [reason, setReason] = useState("ABUSIVE");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);

	if (sent) return <span className="text-xs text-muted-foreground">{t("thanks")}</span>;

	return (
		<details className="text-xs text-muted-foreground">
			<summary className="cursor-pointer hover:underline">{t("report")}</summary>
			{isAuthenticated ? (
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<select className="rounded-md border bg-background px-2 py-1" value={reason} onChange={(e) => setReason(e.target.value)} aria-label={t("reason")}>
						{REASONS.map((r) => (
							<option key={r.value} value={r.value}>{t(r.label)}</option>
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
								toast.error(error instanceof Error ? error.message : t("failed"));
								setBusy(false);
							}
						}}
					>
						{t("send")}
					</button>
				</div>
			) : (
				<p className="mt-2">{t("signIn")}</p>
			)}
		</details>
	);
}
