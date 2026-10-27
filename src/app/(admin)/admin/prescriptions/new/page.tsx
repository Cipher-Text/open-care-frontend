"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctorGrants } from "@/api/consents";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConsentFlow } from "@/components/admin/prescriptions/consent-flow";
import { PrescriptionForm } from "@/components/admin/prescriptions/prescription-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";

function NewPrescription() {
	const { hasPermission } = usePermissions();
	const patientId = Number(useSearchParams().get("patient"));
	const grants = useQuery({ queryKey: ["doctor-grants"], queryFn: fetchDoctorGrants, enabled: patientId > 0 });
	const grant = grants.data?.find((g) => g.patientProfileId === patientId);

	if (!hasPermission("create-prescription")) {
		return (
			<Alert>
				<AlertDescription>You do not have permission to write prescriptions.</AlertDescription>
			</Alert>
		);
	}
	if (!patientId) return <ConsentFlow />;
	if (grants.isLoading) return <Skeleton className="h-96 w-full" />;
	if (!grant) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					This patient&apos;s consent is not valid any more.{" "}
					<Link href="/admin/prescriptions/new" className="underline">
						Ask for consent again
					</Link>
					.
				</AlertDescription>
			</Alert>
		);
	}
	return (
		<PrescriptionForm
			patient={{ profileId: grant.patientProfileId, name: grant.patientName ?? "Patient", age: grant.patientAge, gender: grant.patientGender }}
		/>
	);
}

export default function NewPrescriptionPage() {
	return (
		<div className="flex-1">
			<AdminHeader title="New prescription" description="Choose a patient who has agreed, then write the prescription" />
			<div className="mx-auto max-w-4xl p-4 md:p-8">
				<Suspense fallback={null}>
					<NewPrescription />
				</Suspense>
			</div>
		</div>
	);
}
