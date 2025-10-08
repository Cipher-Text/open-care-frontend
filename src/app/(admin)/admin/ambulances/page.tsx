"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchAmbulances } from "@/api/ambulances";
import { AmbulancesListResponse } from "@/types/ambulances";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function AmbulancesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    sort: "id",
    direction: "DESC",
    status: "",
  });
  const router = useRouter();

  // Fetch ambulances with filters
  const {
    data: ambulancesData,
    isLoading,
    isError,
    error,
  } = useQuery<AmbulancesListResponse>({
    queryKey: ["ambulances", currentPage, filters],
    queryFn: () =>
      fetchAmbulances({
        page: currentPage - 1, // API uses 0-based pagination
        size: 10,
        sort: filters.sort,
        direction: filters.direction,
        vehicleNumber: filters.search || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = useCallback(
    (newFilters: {
      search?: string;
      sort?: string;
      direction?: string;
      status?: string;
    }) => {
      const prevFilters = filters;
      const hasFiltersChanged =
        newFilters.search !== prevFilters.search ||
        newFilters.sort !== prevFilters.sort ||
        newFilters.direction !== prevFilters.direction ||
        newFilters.status !== prevFilters.status;

      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Only reset to first page if filters actually changed
      if (hasFiltersChanged) {
        setCurrentPage(1);
      }
    },
    [filters]
  );

  // Apply client-side status filtering since API might not support it
  const filteredData =
    ambulancesData?.ambulances?.filter((ambulance) => {
      if (!filters.status) return true;

      switch (filters.status) {
        case "available":
          return ambulance.isAvailable;
        case "busy":
          return !ambulance.isAvailable;
        case "active":
          return ambulance.isActive;
        case "inactive":
          return !ambulance.isActive;
        default:
          return true;
      }
    }) || [];

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading ambulances:{" "}
            {(error as Error)?.message || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Ambulance Management"
        description="Manage and monitor ambulance fleet and driver information"
      >
        <Button onClick={() => router.push("/admin/ambulances/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ambulance
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
                data={filteredData}
                totalItems={
                  filters.status
                    ? filteredData.length
                    : ambulancesData?.totalItems
                }
                currentPage={
                  ambulancesData?.currentPage
                    ? ambulancesData.currentPage + 1
                    : 1
                }
                totalPages={filters.status ? 1 : ambulancesData?.totalPages}
                onPageChange={filters.status ? undefined : handlePageChange}
                onFilterChange={handleFilterChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
