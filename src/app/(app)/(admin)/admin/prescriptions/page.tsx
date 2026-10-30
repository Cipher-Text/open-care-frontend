"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { fetchPrescriptions } from "@/api/prescriptions";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import { usePermissions } from "@/hooks/use-permissions";

const PAGE_SIZE = 10;

function PrescriptionsList() {
	const { get, set } = useUrlParams();
	const { hasPermission } = usePermissions();
	const page = parsePage(get("page"));
	const patient = get("patient");
	const from = get("from");
	const to = get("to");

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["prescriptions", page, patient, from, to],
		queryFn: () => fetchPrescriptions({ page, size: PAGE_SIZE, patient, from, to }),
	});

	return (
		<div className="flex-1 print:hidden">
			<AdminHeader title="Prescriptions" description="The prescriptions you have written">
				{hasPermission("create-prescription") && (
					<Button asChild>
						<Link href="/admin/prescriptions/new">
							<Plus className="mr-1.5 size-4" aria-hidden="true" />
							New prescription
						</Link>
					</Button>
				)}
			</AdminHeader>

			<div className="space-y-4 p-4 md:p-8">
				<div className="flex flex-wrap items-end gap-3" role="search">
					<div className="min-w-56 flex-1">
						<label htmlFor="rx-patient" className="mb-1 block text-sm font-medium">
							Patient name
						</label>
						<Input id="rx-patient" defaultValue={patient} placeholder="Search by patient" onChange={(e) => set({ patient: e.target.value })} />
					</div>
					<div>
						<label htmlFor="rx-from" className="mb-1 block text-sm font-medium">
							From
						</label>
						<Input id="rx-from" type="date" value={from} onChange={(e) => set({ from: e.target.value })} />
					</div>
					<div>
						<label htmlFor="rx-to" className="mb-1 block text-sm font-medium">
							To
						</label>
						<Input id="rx-to" type="date" value={to} onChange={(e) => set({ to: e.target.value })} />
					</div>
				</div>

				{isError && (
					<Alert variant="destructive">
						<AlertDescription>{error instanceof Error ? error.message : "Failed to load prescriptions"}</AlertDescription>
					</Alert>
				)}

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>No</TableHead>
								<TableHead>Patient</TableHead>
								<TableHead>Diagnosis</TableHead>
								<TableHead className="text-right">Medicines</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading &&
								Array.from({ length: 4 }, (_, i) => (
									<TableRow key={i}>
										<TableCell colSpan={5}>
											<Skeleton className="h-5 w-full" />
										</TableCell>
									</TableRow>
								))}
							{data?.content.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
										{patient || from || to ? "No prescription matches these filters." : "You have not written any prescription yet."}
									</TableCell>
								</TableRow>
							)}
							{data?.content.map((p) => (
								<TableRow key={p.id}>
									<TableCell className="whitespace-nowrap">{p.prescriptionDate.slice(0, 10)}</TableCell>
									<TableCell className="whitespace-nowrap">
										<Link href={`/admin/prescriptions/${p.id}`} className="font-medium text-primary hover:underline">
											{p.prescriptionNo}
										</Link>
										{p.supersededById && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Replaced</span>}
										{p.replacesId && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Corrected copy</span>}
									</TableCell>
									<TableCell>
										{p.patientName}
										<span className="block text-xs text-muted-foreground">
											{[p.patientAge != null ? `${p.patientAge} yrs` : null, p.patientGender?.toLowerCase(), p.patientPhone]
												.filter(Boolean)
												.join(" · ")}
										</span>
									</TableCell>
									<TableCell className="max-w-xs truncate">{p.diagnosis}</TableCell>
									<TableCell className="text-right">{p.medicineCount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{data && data.totalPages > 1 && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Page {data.currentPage} of {data.totalPages} ({data.totalItems} prescriptions)
						</span>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })}>
								Previous
							</Button>
							<Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => set({ page: String(page + 1) })}>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default function PrescriptionsPage() {
	return (
		<Suspense fallback={null}>
			<PrescriptionsList />
		</Suspense>
	);
}
