"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	fetchConsentRequest,
	fetchDoctorGrants,
	lookupPatient,
	requestConsent,
	verifyConsentCode,
} from "@/api/consents";
import { Field } from "@/components/admin/advertisements/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ConsentRequest, PatientLookup } from "@/types/consents";

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * Step before writing a prescription: pick a patient who already consented, or find a registered patient,
 * ask for consent, and continue once they approve (by the SMS code or in their own account).
 */
export function ConsentFlow() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [identifier, setIdentifier] = useState("");
	const [patient, setPatient] = useState<PatientLookup | null>(null);
	const [request, setRequest] = useState<ConsentRequest | null>(null);
	const [code, setCode] = useState("");

	const grants = useQuery({ queryKey: ["doctor-grants"], queryFn: fetchDoctorGrants, staleTime: 30_000 });

	const find = useMutation({
		mutationFn: () => lookupPatient(identifier.trim()),
		onSuccess: (found) => {
			setPatient(found);
			setRequest(null);
			setCode("");
		},
	});

	const ask = useMutation({
		mutationFn: () => requestConsent(patient!.profileId),
		onSuccess: (created) => {
			setRequest(created);
			setCode("");
		},
	});

	const approved = (r: ConsentRequest) => {
		queryClient.invalidateQueries({ queryKey: ["doctor-grants"] });
		router.push(`/admin/prescriptions/new?patient=${patient!.profileId}`);
		return r;
	};

	// While waiting, check every few seconds in case the patient approved in their own account
	const waiting = request?.status === "PENDING";
	useQuery({
		queryKey: ["consent-request", request?.id],
		queryFn: async () => {
			const latest = await fetchConsentRequest(request!.id);
			if (latest.status !== "PENDING") setRequest(latest);
			if (latest.status === "APPROVED") approved(latest);
			return latest;
		},
		enabled: waiting,
		refetchInterval: 3000,
	});

	const verify = useMutation({
		mutationFn: () => verifyConsentCode(request!.id, code.trim()),
		onSuccess: (r) => {
			setRequest(r);
			approved(r);
		},
	});

	return (
		<div className="space-y-6">
			{grants.data && grants.data.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<ShieldCheck className="size-5 text-primary" aria-hidden="true" />
							Patients who have consented
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="divide-y">
							{grants.data.map((g) => (
								<li key={g.grantId} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
									<div>
										<p className="font-medium">{g.patientName}</p>
										<p className="text-sm text-muted-foreground">
											{[g.patientAge != null ? `${g.patientAge} yrs` : null, g.patientGender?.toLowerCase(), `valid until ${when(g.expiresAt)}`]
												.filter(Boolean)
												.join(" · ")}
										</p>
									</div>
									<Button size="sm" onClick={() => router.push(`/admin/prescriptions/new?patient=${g.patientProfileId}`)}>
										Write prescription
									</Button>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Find a registered patient</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Enter the patient&apos;s phone number, email or username exactly. Prescriptions can only be written for registered patients who agree.
					</p>
					<form
						className="flex flex-wrap items-end gap-3"
						onSubmit={(e) => {
							e.preventDefault();
							if (identifier.trim().length >= 5) find.mutate();
						}}
					>
						<div className="min-w-64 flex-1">
							<Field id="patient-identifier" label="Phone, email or username">
								<Input id="patient-identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="off" />
							</Field>
						</div>
						<Button type="submit" disabled={find.isPending || identifier.trim().length < 5}>
							{find.isPending ? <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" /> : <Search className="mr-1.5 size-4" aria-hidden="true" />}
							Find patient
						</Button>
					</form>
					{find.isError && (
						<p role="alert" className="text-sm text-destructive">
							{(find.error as Error).message}
						</p>
					)}

					{patient && (
						<div className="space-y-4 rounded-md border p-4">
							<div>
								<p className="font-medium">{patient.name}</p>
								<p className="text-sm text-muted-foreground">
									{[patient.age != null ? `${patient.age} yrs` : null, patient.gender?.toLowerCase(), patient.maskedPhone]
										.filter(Boolean)
										.join(" · ")}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">Check this is the person in front of you before asking for consent.</p>
							</div>

							{!request && (
								<Button onClick={() => ask.mutate()} disabled={ask.isPending}>
									{ask.isPending ? "Sending..." : "Ask for consent"}
								</Button>
							)}
							{ask.isError && (
								<p role="alert" className="text-sm text-destructive">
									{(ask.error as Error).message}
								</p>
							)}

							{request?.status === "PENDING" && (
								<div className="space-y-3">
									<p className="text-sm">
										{request.maskedPhone
											? `A 6-digit code was texted to ${request.maskedPhone}. Ask the patient for it, or ask them to approve in their Open Care account.`
											: "This patient has no phone on their profile. Ask them to approve in their Open Care account."}{" "}
										<span className="text-muted-foreground">Valid until {when(request.expiresAt)}.</span>
									</p>
									{request.devCode && (
										<p className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">
											Development only: the code is <strong>{request.devCode}</strong>
										</p>
									)}
									{request.maskedPhone && (
										<form
											className="flex flex-wrap items-end gap-3"
											onSubmit={(e) => {
												e.preventDefault();
												if (/^[0-9]{6}$/.test(code.trim())) verify.mutate();
											}}
										>
											<div className="w-44">
												<Field id="consent-code" label="Code from the patient">
													<Input
														id="consent-code"
														inputMode="numeric"
														maxLength={6}
														value={code}
														onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
														autoComplete="one-time-code"
													/>
												</Field>
											</div>
											<Button type="submit" disabled={verify.isPending || code.length !== 6}>
												{verify.isPending ? "Checking..." : "Confirm code"}
											</Button>
											<Button type="button" variant="outline" onClick={() => ask.mutate()} disabled={ask.isPending}>
												Send a new code
											</Button>
										</form>
									)}
									{verify.isError && (
										<p role="alert" className="text-sm text-destructive">
											{(verify.error as Error).message}
										</p>
									)}
									<p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
										<Loader2 className="size-4 animate-spin" aria-hidden="true" />
										Waiting for the patient...
									</p>
								</div>
							)}

							{request && request.status !== "PENDING" && request.status !== "APPROVED" && (
								<div className="space-y-2">
									<p role="alert" className="text-sm text-destructive">
										{request.status === "DENIED"
											? "The patient declined."
											: request.status === "EXPIRED"
											? "The request expired."
											: "The request was closed."}
									</p>
									<Button variant="outline" onClick={() => ask.mutate()} disabled={ask.isPending}>
										Send a new request
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
