"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPrescription } from "@/api/prescriptions";
import { AdminHeader } from "@/components/admin/admin-header";
import { PrescriptionForm } from "@/components/admin/prescriptions/prescription-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditPrescriptionPage() {
	const { id } = useParams<{ id: string }>();
	const { hasPermission } = usePermissions();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["prescription", id],
		queryFn: () => fetchPrescription(id),
		retry: false,
	});

	return (
		<div className="flex-1">
			<AdminHeader title="Edit prescription" description={data ? `${data.prescriptionNo} for ${data.patientName}` : undefined} />
			<div className="mx-auto max-w-4xl p-4 md:p-8">
				{!hasPermission("update-prescription") ? (
					<Alert>
						<AlertDescription>You do not have permission to edit prescriptions.</AlertDescription>
					</Alert>
				) : (
					<>
						{isLoading && <Skeleton className="h-96 w-full" />}
						{isError && (
							<Alert variant="destructive">
								<AlertDescription>{error instanceof Error ? error.message : "Failed to load the prescription"}</AlertDescription>
							</Alert>
						)}
						{data && <PrescriptionForm prescription={data} />}
					</>
				)}
			</div>
		</div>
	);
}
