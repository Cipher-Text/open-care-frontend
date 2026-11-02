"use client";

import { useState } from "react";
import { toast } from "sonner";
import { voidPrescription } from "@/api/prescriptions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VOID_REASON_MAX, voidReasonError } from "@/lib/prescription-void";

/**
 * Marks a prescription as written by mistake. It is kept exactly as written and shown as void to the doctor and the patient,
 * who is told; it can no longer be edited or replaced.
 */
export function VoidPrescriptionDialog({ id, number, open, onClose, onVoided }: { id: number; number: string; open: boolean; onClose: () => void; onVoided: () => void }) {
	const [reason, setReason] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const submit = async () => {
		const problem = voidReasonError(reason);
		if (problem) return setError(problem);
		setBusy(true);
		setError(null);
		try {
			await voidPrescription(id, reason.trim());
			toast.success("The prescription is marked as written by mistake");
			setReason("");
			onVoided();
			onClose();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not mark the prescription");
		} finally {
			setBusy(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Mark {number} as written by mistake?</DialogTitle>
					<DialogDescription>
						The prescription is kept as written, but it is shown as void: the patient is told not to use it, and you can no longer edit or replace it. If the patient still needs medicine, write a new prescription.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-1">
					<Label htmlFor="void-reason">Why (the patient can read this)</Label>
					<Textarea id="void-reason" rows={3} maxLength={VOID_REASON_MAX} value={reason} onChange={(e) => setReason(e.target.value)} />
				</div>
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
					<Button variant="destructive" onClick={submit} disabled={busy}>{busy ? "Saving..." : "Mark as written by mistake"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
