"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchMedicalTests } from "@/api/medical-tests";
import { MedicalTestsListResponse } from "@/types/medical-tests";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MedicalTestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    sort: "id",
    direction: "ASC" as "ASC" | "DESC",
  });
  const router = useRouter();

  // Fetch medical tests with filters
  const {
    data: testsData,
    isLoading,
    isError,
    error,
  } = useQuery<MedicalTestsListResponse>({
    queryKey: ["medical-tests", currentPage, filters],
    queryFn: () =>
      fetchMedicalTests({
        page: currentPage - 1, // API uses 0-based pagination
        size: 10,
        sort: filters.sort,
        direction: filters.direction,
        name: filters.search || undefined,
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
      direction?: "ASC" | "DESC";
    }) => {
      const prevFilters = filters;
      const hasFiltersChanged =
        newFilters.search !== prevFilters.search ||
        newFilters.sort !== prevFilters.sort ||
        newFilters.direction !== prevFilters.direction;

      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Only reset to first page if filters actually changed
      if (hasFiltersChanged && newFilters.search !== undefined) {
        setCurrentPage(1);
      }
    },
    [filters]
  );

  const displayData = testsData?.medicalTests || [];
  const totalItems = testsData?.totalItems || 0;
  const totalPages = testsData?.totalPages || 0;
  const currentPageDisplay = testsData?.currentPage
    ? testsData.currentPage + 1
    : 1;

  if (isError) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Medical Tests Management"
          description="Manage and monitor medical tests and diagnostic procedures"
        >
          <Button onClick={() => router.push("/admin/medical-tests/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medical Test
          </Button>
        </AdminHeader>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Error loading medical tests:{" "}
                {(error as Error)?.message || "Unknown error"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Medical Tests Management"
        description="Manage and monitor medical tests and diagnostic procedures"
      >
        <Button onClick={() => router.push("/admin/medical-tests/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medical Test
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
                data={displayData}
                totalItems={totalItems}
                currentPage={currentPageDisplay}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                sort={filters.sort}
                direction={filters.direction}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
