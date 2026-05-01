"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchDoctorDetailsById } from "@/api/doctors";
import { DoctorDetailsResponse } from "@/types/doctors";
import { AdminHeader } from "@/components/admin/admin-header";
import { DetailView } from "@/components/admin/detail-view";
import { buildDoctorDetailSections } from "@/components/admin/build-doctor-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DoctorViewPage() {
	const params = useParams();
	const router = useRouter();
	const doctorId = parseInt(params.id as string);

	const {
		data: doctor,
		isLoading,
		isError,
		error,
	} = useQuery<DoctorDetailsResponse>({
		queryKey: ["doctor-details", doctorId],
		queryFn: () => fetchDoctorDetailsById(doctorId),
		enabled: !!doctorId,
	});

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader
					title="Doctor Details"
					description="Loading doctor information..."
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

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-32 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader title="Doctor Details" description="Error loading doctor">
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
							: "Failed to load doctor details"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!doctor) {
		return (
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AdminHeader title="Doctor Details" description="Doctor not found">
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
						Doctor not found or may have been deleted.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<AdminHeader
				title={doctor.profile.name}
				description={`${doctor.bmdcNo} - Doctor Profile`}
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

			<DetailView sections={buildDoctorDetailSections(doctor)} />
		</div>
	);
}
