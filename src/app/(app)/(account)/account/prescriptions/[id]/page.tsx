"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { fetchMyPrescription } from "@/api/prescriptions";
import { PrescriptionDocument } from "@/components/admin/prescriptions/prescription-document";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** One of the signed-in person's own prescriptions, as it is printed. */
export default function MyPrescriptionPage() {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, error } = useQuery({ queryKey: ["my-prescription", id], queryFn: () => fetchMyPrescription(id), retry: false });

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2 print:hidden">
				<Button variant="outline" asChild>
					<Link href="/account/prescriptions">
						<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
						All my prescriptions
					</Link>
				</Button>
				{data && (
					<Button onClick={() => window.print()}>
						<Printer className="mr-1.5 size-4" aria-hidden="true" />
						Print or save as PDF
					</Button>
				)}
			</div>
			{isLoading && <Skeleton className="mx-auto h-96 max-w-3xl" />}
			{isError && (
				<Alert variant="destructive" className="mx-auto max-w-3xl print:hidden">
					<AlertDescription>{error instanceof Error ? error.message : "Could not load the prescription"}</AlertDescription>
				</Alert>
			)}
			{data && <PrescriptionDocument prescription={data} />}
		</div>
	);
}
