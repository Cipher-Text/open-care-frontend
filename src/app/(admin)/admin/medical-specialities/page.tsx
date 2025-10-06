"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchMedicalSpecialities } from "@/api/medical-specialities";
import { MedicalSpecialitiesListResponse } from "@/types/medical-specialities";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MedicalSpecialitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
  });
  const router = useRouter();

  // Fetch medical specialities with filters
  const {
    data: specialitiesData,
    isLoading,
    isError,
    error,
  } = useQuery<MedicalSpecialitiesListResponse>({
    queryKey: ["medical-specialities", currentPage, filters],
    queryFn: () =>
      fetchMedicalSpecialities({
        page: currentPage - 1, // API uses 0-based pagination
        size: 10,
        name: filters.search || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = useCallback(
    (newFilters: { search?: string; type?: string }) => {
      const prevFilters = filters;
      const hasFiltersChanged =
        newFilters.search !== prevFilters.search ||
        newFilters.type !== prevFilters.type;

      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Only reset to first page if filters actually changed
      if (hasFiltersChanged) {
        setCurrentPage(1);
      }
    },
    [filters]
  );

  // Filter data based on client-side type filter since API doesn't support this
  // When type filter is active, we disable pagination to avoid confusion
  const shouldShowPagination = !filters.type;
  const displayData = specialitiesData?.medicalSpecialities || [];
  const filteredData = filters.type
    ? displayData.filter((speciality) => {
        const matchesType =
          (filters.type === "main" && !speciality.parentId) ||
          (filters.type === "sub" && speciality.parentId);
        return matchesType;
      })
    : displayData;

  // Use original pagination data when no type filter, filtered data count when type filter is active
  const totalItems = filters.type
    ? filteredData.length
    : specialitiesData?.totalItems;
  const totalPages = filters.type ? 1 : specialitiesData?.totalPages;
  const currentPageDisplay = filters.type
    ? 1
    : specialitiesData?.currentPage
    ? specialitiesData.currentPage + 1
    : 1;
  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading medical specialities:{" "}
            {(error as Error)?.message || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Medical Specialities Management"
        description="Manage and monitor medical specialities and their associated doctors"
      >
        <Button onClick={() => router.push("/admin/medical-specialities/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Speciality
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
                totalItems={totalItems}
                currentPage={currentPageDisplay}
                totalPages={totalPages}
                onPageChange={
                  shouldShowPagination ? handlePageChange : undefined
                }
                onFilterChange={handleFilterChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
