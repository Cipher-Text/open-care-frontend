import { Badge } from "@/components/ui/badge";
import type { VerificationStatus } from "@/types/verification";

const LABELS: Record<VerificationStatus, string> = {
	NONE: "Not requested",
	DRAFT: "Draft",
	PENDING: "Waiting for review",
	UNDER_REVIEW: "Being reviewed",
	VERIFIED: "Verified",
	REJECTED: "Not approved",
	REVOKED: "Verification withdrawn",
	WITHDRAWN: "Withdrawn",
};

export const statusLabel = (status: VerificationStatus) => LABELS[status] ?? status;

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
	const variant = status === "VERIFIED" ? "default" : status === "REJECTED" || status === "REVOKED" ? "destructive" : "secondary";
	return <Badge variant={variant}>{statusLabel(status)}</Badge>;
}

export const dateTime = (value?: string | null) => (value ? new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "-");
