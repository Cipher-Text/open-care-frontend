"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPrescription } from "@/api/prescriptions";
import { AdminHeader } from "@/components/admin/admin-header";
import { PrescriptionForm } from "@/components/admin/prescriptions/prescription-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";

/** Write a corrected copy of a prescription that can no longer be edited. The old one is kept and marked as replaced. */
export default function ReplacePrescriptionPage() {
	const { id } = useParams<{ id: string }>();
	const { hasPermission } = usePermissions();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["prescription", id],
		queryFn: () => fetchPrescription(id),
		retry: false,
	});

	return (
		<div className="flex-1">
			<AdminHeader title="Corrected prescription" description={data ? `Replaces ${data.prescriptionNo} for ${data.patientName}` : undefined} />
			<div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
				{!hasPermission("create-prescription") ? (
					<Alert>
						<AlertDescription>You do not have permission to write prescriptions.</AlertDescription>
					</Alert>
				) : (
					<>
						{isLoading && <Skeleton className="h-96 w-full" />}
						{isError && (
							<Alert variant="destructive">
								<AlertDescription>{error instanceof Error ? error.message : "Failed to load the prescription"}</AlertDescription>
							</Alert>
						)}
						{data?.supersededById && (
							<Alert>
								<AlertDescription>
									This prescription was already replaced{data.supersededByNo ? ` by ${data.supersededByNo}` : ""}.{" "}
									<Link href={`/admin/prescriptions/${data.supersededById}`} className="font-medium underline">
										Open the newer one
									</Link>
									.
								</AlertDescription>
							</Alert>
						)}
						{data && !data.supersededById && data.editable !== false && (
							<Alert>
								<AlertDescription>
									This prescription can still be edited, so it does not need a corrected copy.{" "}
									<Link href={`/admin/prescriptions/${data.id}/edit`} className="font-medium underline">
										Edit it
									</Link>
									.
								</AlertDescription>
							</Alert>
						)}
						{data && !data.supersededById && data.editable === false && (
							<>
								<Alert>
									<AlertDescription>
										{data.prescriptionNo} stays exactly as it was written and is marked as replaced. The patient must still have given consent: if the consent
										has expired, ask for it again first. The patient cannot be changed.
									</AlertDescription>
								</Alert>
								<PrescriptionForm prescription={data} replacing />
								<Button variant="ghost" asChild>
									<Link href={`/admin/prescriptions/${data.id}`}>Cancel</Link>
								</Button>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
