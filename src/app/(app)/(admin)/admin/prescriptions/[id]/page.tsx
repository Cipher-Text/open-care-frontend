"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FilePlus2, Pencil, Printer } from "lucide-react";
import { fetchPrescription } from "@/api/prescriptions";
import { AdminHeader } from "@/components/admin/admin-header";
import { PrescriptionDocument } from "@/components/admin/prescriptions/prescription-document";
import { PrescriptionHistory } from "@/components/admin/prescriptions/prescription-history";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";

export default function PrescriptionPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { hasPermission } = usePermissions();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["prescription", id],
		queryFn: () => fetchPrescription(id),
		retry: false,
	});

	return (
		<div className="flex-1">
			<div className="print:hidden">
				<AdminHeader title={data ? `Prescription ${data.prescriptionNo}` : "Prescription"} description={data?.patientName}>
					<Button variant="outline" onClick={() => router.push("/admin/prescriptions")}>
						<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
						All prescriptions
					</Button>
					{data && hasPermission("update-prescription") && data.editable !== false && !data.supersededById && (
						<Button variant="outline" asChild>
							<Link href={`/admin/prescriptions/${data.id}/edit`}>
								<Pencil className="mr-1.5 size-4" aria-hidden="true" />
								Edit
							</Link>
						</Button>
					)}
					{data && hasPermission("create-prescription") && data.editable === false && !data.supersededById && (
						<Button variant="outline" asChild>
							<Link href={`/admin/prescriptions/${data.id}/replace`}>
								<FilePlus2 className="mr-1.5 size-4" aria-hidden="true" />
								Write a corrected copy
							</Link>
						</Button>
					)}
					{data && (
						<Button onClick={() => window.print()}>
							<Printer className="mr-1.5 size-4" aria-hidden="true" />
							Print or save as PDF
						</Button>
					)}
				</AdminHeader>
			</div>
			<div className="p-4 md:p-8 print:p-0">
				{isLoading && <Skeleton className="mx-auto h-96 max-w-3xl" />}
				{isError && (
					<Alert variant="destructive">
						<AlertDescription>{error instanceof Error ? error.message : "Failed to load the prescription"}</AlertDescription>
					</Alert>
				)}
				{data && data.editable === false && !data.supersededById && (
					<Alert className="mx-auto mb-4 max-w-3xl print:hidden">
						<AlertDescription>
							Editing closed{data.editableUntil ? ` on ${new Date(data.editableUntil).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}` : ""}.
							To correct this prescription, write a corrected copy: the old one is kept and marked as replaced.
						</AlertDescription>
					</Alert>
				)}
				{data?.supersededById && (
					<Alert className="mx-auto mb-4 max-w-3xl print:hidden">
						<AlertDescription>
							This prescription was replaced{data.supersededByNo ? ` by ${data.supersededByNo}` : ""}. It is kept as it was written and cannot be edited.{" "}
							<Link href={`/admin/prescriptions/${data.supersededById}`} className="font-medium underline">
								Open the newer one
							</Link>
							.
						</AlertDescription>
					</Alert>
				)}
				{data && <PrescriptionDocument prescription={data} />}
				{data && <PrescriptionHistory prescription={data} />}
			</div>
		</div>
	);
}
