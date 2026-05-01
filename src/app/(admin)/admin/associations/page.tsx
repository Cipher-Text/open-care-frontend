"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchAssociations } from "@/api/associations";
import { AssociationsListResponse } from "@/types/associations";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function AssociationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    sort: "id",
    direction: "DESC",
  });
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canCreateAssociation = hasPermission("create-master-data");

  // Fetch associations with filters
  const {
    data: associationsData,
    isLoading,
    isError,
    error,
  } = useQuery<AssociationsListResponse>({
    queryKey: ["associations", currentPage, filters],
    queryFn: () =>
      fetchAssociations({
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
    (newFilters: { search?: string; sort?: string; direction?: string }) => {
      const prevFilters = filters;
      const hasFiltersChanged =
        newFilters.search !== prevFilters.search ||
        newFilters.sort !== prevFilters.sort ||
        newFilters.direction !== prevFilters.direction;

      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Only reset to first page if filters actually changed
      if (hasFiltersChanged) {
        setCurrentPage(1);
      }
    },
    [filters]
  );

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading associations:{" "}
            {(error as Error)?.message || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Medical Associations Management"
        description="Manage and monitor medical associations and professional organizations"
      >
        {canCreateAssociation && (
          <Button onClick={() => router.push("/admin/associations/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Association
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
                data={associationsData?.associations || []}
                totalItems={associationsData?.totalItems}
                currentPage={
                  associationsData?.currentPage
                    ? associationsData.currentPage + 1
                    : 1
                }
                totalPages={associationsData?.totalPages}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
