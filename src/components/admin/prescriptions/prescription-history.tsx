"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { fetchRevisions } from "@/api/prescriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Prescription } from "@/types/prescriptions";

const dateTime = (value: string) => new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * What a prescription said before each edit, and which prescriptions it replaced or was replaced by. Not printed.
 * Nothing is shown for a prescription that was never edited or replaced.
 */
export function PrescriptionHistory({ prescription }: { prescription: Prescription }) {
	const revisions = useQuery({
		queryKey: ["prescription-revisions", prescription.id],
		queryFn: () => fetchRevisions(prescription.id),
		retry: false,
	});
	const versions = revisions.data ?? [];
	if (versions.length === 0 && !prescription.replacesId && !prescription.supersededById) return null;

	return (
		<Card className="mx-auto mt-6 max-w-3xl print:hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<History className="size-4" aria-hidden="true" />
					History of {prescription.prescriptionNo}
				</CardTitle>
				<CardDescription>Nothing is overwritten: every earlier version is kept as it was.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 text-sm">
				{prescription.replacesId && (
					<p>
						This prescription replaces{" "}
						<Link href={`/admin/prescriptions/${prescription.replacesId}`} className="font-medium text-primary hover:underline">
							{prescription.replacesNo ?? `#${prescription.replacesId}`}
						</Link>
						, which could no longer be edited.
					</p>
				)}
				{prescription.supersededById && (
					<p>
						Replaced{prescription.supersededAt ? ` on ${dateTime(prescription.supersededAt)}` : ""} by{" "}
						<Link href={`/admin/prescriptions/${prescription.supersededById}`} className="font-medium text-primary hover:underline">
							{prescription.supersededByNo ?? `#${prescription.supersededById}`}
						</Link>
						.
					</p>
				)}
				{revisions.isError && <p className="text-muted-foreground">The earlier versions could not be loaded.</p>}
				{versions.length > 0 && (
					<ol className="space-y-2">
						{versions.map((version) => (
							<li key={version.revisionNo} className="rounded-md border p-3">
								<details>
									<summary className="cursor-pointer font-medium">
										Version {version.revisionNo}, before the edit of {dateTime(version.editedAt)}
									</summary>
									<dl className="mt-3 space-y-1">
										{version.snapshot.chiefComplaint && (
											<div>
												<dt className="inline font-semibold">Complaint: </dt>
												<dd className="inline">{version.snapshot.chiefComplaint}</dd>
											</div>
										)}
										<div>
											<dt className="inline font-semibold">Diagnosis: </dt>
											<dd className="inline">{version.snapshot.diagnosis}</dd>
										</div>
										{version.snapshot.investigations && (
											<div>
												<dt className="inline font-semibold">Investigations: </dt>
												<dd className="inline">{version.snapshot.investigations}</dd>
											</div>
										)}
										<div>
											<dt className="font-semibold">Medicines</dt>
											<dd>
												<ul className="list-disc pl-5">
													{version.snapshot.medicines.map((line, index) => (
														<li key={index}>
															{[line.medicineName, line.dosage, line.frequency, line.duration].filter(Boolean).join(", ")}
														</li>
													))}
												</ul>
											</dd>
										</div>
										{version.snapshot.advice && (
											<div>
												<dt className="inline font-semibold">Advice: </dt>
												<dd className="inline">{version.snapshot.advice}</dd>
											</div>
										)}
									</dl>
								</details>
							</li>
						))}
					</ol>
				)}
			</CardContent>
		</Card>
	);
}
