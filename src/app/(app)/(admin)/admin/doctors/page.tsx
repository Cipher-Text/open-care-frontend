"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import { fetchAdminDoctors } from "@/api/doctors";
import { DoctorListResponse } from "@/types/doctors";
import type { VerificationStatus } from "@/types/verification";
import { statusLabel } from "@/components/verification/status-badge";
import { FilterSelect } from "@/components/common/DirectoryControls";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ALL } from "@/hooks/use-url-params";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

/** The states staff filter by. DRAFT and WITHDRAWN never show on a doctor (the record carries the status of the latest submitted case). */
const STATUS_FILTERS: VerificationStatus[] = ["VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED", "REVOKED", "NONE"];

export default function DoctorsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState("");
	const [reviewDue, setReviewDue] = useState(false);
	const router = useRouter();
	const { hasPermission } = usePermissions();
	const canCreateDoctor = hasPermission("create-doctor");

	const {
		data: doctorsData,
		isLoading,
		isError,
		error,
	} = useQuery<DoctorListResponse>({
		queryKey: ["doctors", currentPage, status, reviewDue],
		queryFn: () =>
			fetchAdminDoctors({
				page: currentPage,
				size: 10,
				verificationStatus: status || undefined,
				reviewDue: reviewDue || undefined,
			}),
		placeholderData: (previousData) => previousData,
	});

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isError) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-destructive">
						Error loading doctors:{" "}
						{(error as Error)?.message || "Unknown error"}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Doctors Management"
				description="Manage and monitor doctor registrations and verifications"
			>
				{canCreateDoctor && (
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push("/admin/doctors/bulk-upload")}
						>
							<Upload className="mr-2 h-4 w-4" />
							Bulk upload
						</Button>
						<Button onClick={() => router.push("/admin/doctors/add")}>
							<Plus className="mr-2 h-4 w-4" />
							Add Doctor
						</Button>
					</div>
				)}
			</AdminHeader>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<Card>
					<CardContent className="pt-6">
						<div className="mb-4 flex flex-wrap items-center gap-4" role="group" aria-label="Verification filters">
							<div className="w-full sm:w-56">
								<FilterSelect
									label="Verification status"
									allLabel="Any verification status"
									value={status}
									onChange={(v) => {
										setStatus(v === ALL ? "" : v);
										setCurrentPage(1);
									}}
									options={STATUS_FILTERS.map((s) => ({ value: s, label: statusLabel(s) }))}
								/>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox
									id="review-due"
									checked={reviewDue}
									onCheckedChange={(checked) => {
										setReviewDue(checked === true);
										setCurrentPage(1);
									}}
								/>
								<Label htmlFor="review-due">Verified more than the review period ago</Label>
							</div>
						</div>
						{isLoading ? (
							<div className="space-y-4">
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</div>
						) : (
							<DataTable
								columns={columns}
								data={doctorsData?.content || []}
								totalItems={doctorsData?.totalItems}
								currentPage={doctorsData?.currentPage}
								totalPages={doctorsData?.totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
