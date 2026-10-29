"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchHospitals } from "@/api/hospitals";
import { fetchUpazilas, fetchUnionsByUpazila } from "@/api/locations";
import { HospitalListResponse } from "@/types/hospitals";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function HospitalsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState({
		search: "",
		upazilaId: "",
		unionId: "",
	});
	const router = useRouter();
	const { hasPermission } = usePermissions();
	const canCreateHospital = hasPermission("create-hospital");

	// Fetch hospitals with filters
	const {
		data: hospitalsData,
		isLoading,
		isError,
		error,
	} = useQuery<HospitalListResponse>({
		queryKey: ["hospitals", currentPage, filters],
		queryFn: () =>
			fetchHospitals({
				page: currentPage,
				size: 10,
				name: filters.search || undefined,
				upazilaId: filters.upazilaId || undefined,
				unionId: filters.unionId || undefined,
			}),
		placeholderData: (previousData) => previousData,
	});

	// Fetch upazilas for filter dropdown (reference data, cached for an hour)
	const { data: upazilas = [], isLoading: isUpazilasLoading } = useQuery({
		queryKey: ["upazilas"],
		queryFn: fetchUpazilas,
		staleTime: 60 * 60 * 1000,
	});

	// Unions are only needed for the upazila picked in the filter: one request when chosen,
	// not one per upazila (that was ~500 requests per page visit and tripped the rate limit)
	const { data: unions = [], isLoading: isUnionsLoading } = useQuery({
		queryKey: ["unions", filters.upazilaId],
		queryFn: () => fetchUnionsByUpazila(Number(filters.upazilaId)),
		enabled: !!filters.upazilaId && filters.upazilaId !== "all",
		staleTime: 60 * 60 * 1000,
	});

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterChange = (newFilters: {
		search?: string;
		upazilaId?: string;
		unionId?: string;
	}) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
		setCurrentPage(1); // Reset to first page when filters change
	};

	if (isError) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-destructive">
						Error loading hospitals:{" "}
						{(error as Error)?.message || "Unknown error"}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Hospitals Management"
				description="Manage and monitor hospital registrations and information"
			>
				{canCreateHospital && (
					<Button onClick={() => router.push("/admin/hospitals/add")}>
						<Plus className="mr-2 h-4 w-4" />
						Add Hospital
					</Button>
				)}
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
								data={hospitalsData?.content || []}
								totalItems={hospitalsData?.totalItems}
								currentPage={hospitalsData?.currentPage}
								totalPages={hospitalsData?.totalPages}
								onPageChange={handlePageChange}
								onFilterChange={handleFilterChange}
								upazilas={upazilas}
								unions={unions}
								isUpazilasLoading={isUpazilasLoading}
								isUnionsLoading={isUnionsLoading}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
