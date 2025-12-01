"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchHospitalDetailsById } from "@/api/hospitals";
import { HospitalDetailsResponse } from "@/types/hospitals";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DetailView } from "@/components/admin/detail-view";
import { buildHospitalDetailSections } from "@/components/admin/build-hospital-sections";

export default function HospitalViewPage() {
	const params = useParams();
	const router = useRouter();
	const hospitalId = parseInt(params.id as string);

	const {
		data: hospital,
		isLoading,
		isError,
		error,
	} = useQuery<HospitalDetailsResponse>({
		queryKey: ["hospital-details", hospitalId],
		queryFn: () => fetchHospitalDetailsById(hospitalId),
		enabled: !!hospitalId,
	});

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader
					title="Hospital Details"
					description="Loading hospital information..."
				>
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
				</AdminHeader>

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-32" />
						</CardHeader>
						<CardContent className="space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader
					title="Hospital Details"
					description="Error loading hospital"
				>
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
				</AdminHeader>

				<Alert variant="destructive">
					<AlertDescription>
						{error instanceof Error
							? error.message
							: "Failed to load hospital details"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!hospital) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader title="Hospital Details" description="Hospital not found">
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
				</AdminHeader>

				<Alert>
					<AlertDescription>
						Hospital not found or may have been deleted.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<AdminHeader
				title={hospital.name}
				description={`${hospital.bnName} - Hospital Details`}
			>
				<Button
					variant="outline"
					onClick={() => router.back()}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>
			</AdminHeader>

			<DetailView sections={buildHospitalDetailSections(hospital)} />
		</div>
	);
}
