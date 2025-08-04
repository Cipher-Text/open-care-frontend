"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchDoctors } from "@/api/doctors";
import { DoctorListResponse } from "@/types/doctors";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function DoctorsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const router = useRouter();

	const {
		data: doctorsData,
		isLoading,
		isError,
		error,
	} = useQuery<DoctorListResponse>({
		queryKey: ["doctors", currentPage],
		queryFn: () =>
			fetchDoctors({
				page: currentPage,
				size: 10,
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
					<div className="text-center text-red-600">
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
				<Button onClick={() => router.push("/admin/doctors/new")}>
					<Plus className="mr-2 h-4 w-4" />
					Add Doctor
				</Button>
			</AdminHeader>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<Card>
					<CardContent className="pt-6">
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
								data={doctorsData?.doctors || []}
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
