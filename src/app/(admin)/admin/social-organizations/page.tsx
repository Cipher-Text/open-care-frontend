"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchSocialOrganizations } from "@/api/social-organizations";
import { SocialOrganizationsListResponse } from "@/types/social-organizations";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function SocialOrganizationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    sort: "id",
    direction: "ASC" as "ASC" | "DESC",
  });
  const router = useRouter();

  // Fetch social organizations with filters
  const {
    data: organizationsData,
    isLoading,
    isError,
    error,
  } = useQuery<SocialOrganizationsListResponse>({
    queryKey: ["social-organizations", currentPage, filters],
    queryFn: () =>
      fetchSocialOrganizations({
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

  const displayData = organizationsData?.socialOrganizations || [];
  const totalItems = organizationsData?.totalItems || 0;
  const totalPages = organizationsData?.totalPages || 0;
  const currentPageDisplay = organizationsData?.currentPage
    ? organizationsData.currentPage + 1
    : 1;

  if (isError) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Social Organizations Management"
          description="Manage and monitor social organizations and NGOs in the healthcare sector"
        >
          <Button
            onClick={() => router.push("/admin/social-organizations/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Social Organization
          </Button>
        </AdminHeader>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Error loading social organizations:{" "}
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
        title="Social Organizations Management"
        description="Manage and monitor social organizations and NGOs in the healthcare sector"
      >
        <Button onClick={() => router.push("/admin/social-organizations/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Social Organization
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
