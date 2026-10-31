"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dateTime } from "@/components/verification/status-badge";
import type { RegisterCheckResult, VerificationCase } from "@/types/verification";

/** The BMDC's own look-up page for registered doctors (a person types the number in there; nothing is sent from here). */
export const BMDC_REGISTER_URL = "https://verify.bmdc.org.bd/";

const RESULTS: { value: RegisterCheckResult; label: string }[] = [
	{ value: "MATCH", label: "In the register and it matches this person" },
	{ value: "MISMATCH", label: "In the register but the details differ" },
	{ value: "NOT_FOUND", label: "Not in the register" },
];

export const registerResultLabel = (result: RegisterCheckResult) => RESULTS.find((r) => r.value === result)?.label ?? result;

/**
 * The reviewer looks the doctor's BMDC number up in the register by hand and records what they found. A doctor request
 * can be approved only after a MATCH is recorded. The register shows registration, not that every document is genuine,
 * so the documents are still checked.
 */
export function RegisterCheckCard({
	verification,
	disabled,
	onRecord,
}: {
	verification: VerificationCase;
	disabled: boolean;
	onRecord: (result: RegisterCheckResult, note: string) => void;
}) {
	const [result, setResult] = useState<RegisterCheckResult | "">("");
	const [note, setNote] = useState("");
	const recorded = verification.registerResult;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
					<span>BMDC register check</span>
					{recorded ? (
						<Badge variant={recorded === "MATCH" ? "default" : "destructive"}>{recorded === "MATCH" ? "Matched" : recorded === "MISMATCH" ? "Details differ" : "Not found"}</Badge>
					) : (
						<Badge variant="secondary">Not checked yet</Badge>
					)}
				</CardTitle>
				<CardDescription>
					Look up the number in the BMDC register, compare the name and degree with the record and the documents, then record what you found. The request can be approved only after a match is
					recorded.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 text-sm">
				<p>
					<span className="font-medium">Number to look up: </span>
					<span className="font-mono">{verification.claimedRegistrationNo ?? "none on the record"}</span>{" "}
					<a href={BMDC_REGISTER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
						Open the BMDC register <ExternalLink className="size-3.5" aria-hidden="true" />
					</a>
				</p>
				{recorded && (
					<Alert>
						<AlertDescription>
							{registerResultLabel(recorded)}. Checked by {verification.registerCheckedBy ?? "staff"}, {dateTime(verification.registerCheckedAt)}.
							{verification.registerNote ? ` Note: ${verification.registerNote}` : ""}
						</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-3 sm:grid-cols-[18rem_1fr]">
					<div className="space-y-1">
						<Label htmlFor="register-result">What the register showed</Label>
						<Select value={result} onValueChange={(v) => setResult(v as RegisterCheckResult)}>
							<SelectTrigger id="register-result" className="w-full">
								<SelectValue placeholder="Choose" />
							</SelectTrigger>
							<SelectContent>
								{RESULTS.map((r) => (
									<SelectItem key={r.value} value={r.value}>
										{r.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="register-note">Note (optional)</Label>
						<Textarea id="register-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} />
					</div>
				</div>
				<Button
					variant="outline"
					disabled={disabled || !result}
					onClick={() => {
						if (result) {
							onRecord(result, note.trim());
							setNote("");
						}
					}}
				>
					{recorded ? "Record the check again" : "Record the check"}
				</Button>
			</CardContent>
		</Card>
	);
}
