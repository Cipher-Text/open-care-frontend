"use client";

import { useState } from "react";
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
    queryKey: ["medical-specialities", filters],
    queryFn: () =>
      fetchMedicalSpecialities({
        search: filters.search || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handleFilterChange = (newFilters: {
    search?: string;
    type?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filter data based on client-side type filter since API doesn't support this
  const filteredData =
    specialitiesData?.specialities?.filter((speciality) => {
      const matchesType =
        !filters.type ||
        (filters.type === "main" && !speciality.parentId) ||
        (filters.type === "sub" && speciality.parentId);

      return matchesType;
    }) || [];
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
                totalItems={filteredData.length}
                currentPage={1}
                totalPages={1}
                onFilterChange={handleFilterChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
