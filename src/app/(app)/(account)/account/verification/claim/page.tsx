"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { startFacilityClaim } from "@/api/verification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ClaimForm() {
	const router = useRouter();
	const hospital = useSearchParams().get("hospital");
	const [note, setNote] = useState("");
	const [busy, setBusy] = useState(false);

	if (!hospital || !/^\d+$/.test(hospital)) {
		return (
			<Alert>
				<AlertDescription>Open a facility&apos;s page in the directory and choose &quot;Claim this facility&quot;.</AlertDescription>
			</Alert>
		);
	}

	const start = async () => {
		setBusy(true);
		try {
			const created = await startFacilityClaim(hospital, note);
			router.push(`/account/verification/${created.id}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not start the claim");
			setBusy(false);
		}
	};

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle className="text-base">Claim this facility</CardTitle>
				<CardDescription>
					You will add the facility&apos;s registration documents next. Staff check them; if approved, the facility is shown as verified and you are listed as its representative.
					Only claim a facility you work for.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1">
					<Label htmlFor="claim-note">Who are you at this facility? (optional)</Label>
					<Textarea id="claim-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} placeholder="For example: manager, owner, administrator" />
				</div>
				<Button onClick={start} disabled={busy}>
					{busy ? "Starting..." : "Start the claim"}
				</Button>
			</CardContent>
		</Card>
	);
}

export default function ClaimPage() {
	return (
		<div className="space-y-4 p-4 md:p-8">
			<Suspense fallback={null}>
				<ClaimForm />
			</Suspense>
		</div>
	);
}
