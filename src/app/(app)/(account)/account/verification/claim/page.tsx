"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { startFacilityClaim, startProfileClaim } from "@/api/verification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Target = { kind: "hospital" | "doctor" | "nurse" | "nutritionist"; id: string };

/** The page is opened from a listing: ?hospital=ID, ?doctor=ID or ?nurse=ID. */
function targetFrom(params: URLSearchParams): Target | null {
	for (const kind of ["hospital", "doctor", "nurse", "nutritionist"] as const) {
		const id = params.get(kind);
		if (id && /^\d+$/.test(id)) return { kind, id };
	}
	return null;
}

const WORDS = {
	nutritionist: {
		title: "Claim this nutritionist profile",
		description:
			"Use this only if the profile is you. Add your qualifications next (your degree certificate, and any registration or membership certificate you hold). Staff check them; if approved, the profile is linked to your account and you can keep it up to date. A registration number is optional: no register is checked. You need a verified mobile number.",
		numberLabel: "Your registration number (if you have one)",
		notePlaceholder: "Your degree, where you work, anything that helps staff check it is you",
		noteLabel: "Note for the reviewer (optional)",
		start: "Start the claim",
	},
	hospital: {
		title: "Claim this facility",
		description:
			"You will add the facility's registration documents next. Staff check them; if approved, the facility is shown as verified and you are listed as its representative. Only claim a facility you work for.",
		notePlaceholder: "For example: manager, owner, administrator",
		noteLabel: "Who are you at this facility? (optional)",
		start: "Start the claim",
	},
	doctor: {
		title: "Claim this doctor profile",
		description:
			"Use this only if the profile is you. Enter your BMDC number and add your registration documents next. Staff look the number up in the BMDC register; if approved, the profile is linked to your account and you can keep it up to date. You need a verified mobile number.",
		numberLabel: "Your BMDC registration number",
		notePlaceholder: "Anything that helps staff check it is you",
		noteLabel: "Note for the reviewer (optional)",
		start: "Start the claim",
	},
	nurse: {
		title: "Claim this nurse profile",
		description:
			"Use this only if the profile is you. Enter your BNMC number and add your registration documents next. Staff check them; if approved, the profile is linked to your account and you can keep it up to date. You need a verified mobile number.",
		numberLabel: "Your BNMC registration number",
		notePlaceholder: "Anything that helps staff check it is you",
		noteLabel: "Note for the reviewer (optional)",
		start: "Start the claim",
	},
} as const;

function ClaimForm() {
	const router = useRouter();
	const target = targetFrom(useSearchParams());
	const [note, setNote] = useState("");
	const [registrationNo, setRegistrationNo] = useState("");
	const [busy, setBusy] = useState(false);

	if (!target) {
		return (
			<Alert>
				<AlertDescription>Open a facility, doctor or nurse page in the directory and choose &quot;Claim&quot;.</AlertDescription>
			</Alert>
		);
	}

	const words = WORDS[target.kind];
	// Doctors (BMDC) and nurses (BNMC) must give their number; a nutritionist may leave it out
	const asksNumber = target.kind !== "hospital";
	const needsNumber = asksNumber && target.kind !== "nutritionist";

	const start = async () => {
		setBusy(true);
		try {
			const created =
				target.kind === "hospital"
					? await startFacilityClaim(target.id, note)
					: await startProfileClaim(target.kind, target.id, registrationNo.trim(), note.trim() || undefined);
			router.push(`/account/verification/${created.id}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not start the claim");
			setBusy(false);
		}
	};

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle className="text-base">{words.title}</CardTitle>
				<CardDescription>{words.description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{asksNumber && "numberLabel" in words && (
					<div className="space-y-1">
						<Label htmlFor="claim-number">{words.numberLabel}</Label>
						<Input id="claim-number" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} maxLength={100} autoComplete="off" />
					</div>
				)}
				<div className="space-y-1">
					<Label htmlFor="claim-note">{words.noteLabel}</Label>
					<Textarea id="claim-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} placeholder={words.notePlaceholder} />
				</div>
				<Button onClick={start} disabled={busy || (needsNumber && !registrationNo.trim())}>
					{busy ? "Starting..." : words.start}
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
