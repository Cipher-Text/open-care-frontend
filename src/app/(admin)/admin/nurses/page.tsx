"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchNurses } from "@/api/nurses";
import { NurseListResponse } from "@/types/nurses";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function NursesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canCreateNurse = hasPermission("create-nurse");

  const {
    data: nursesData,
    isLoading,
    isError,
    error,
  } = useQuery<NurseListResponse>({
    queryKey: ["nurses", currentPage],
    queryFn: () =>
      fetchNurses({
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
            Error loading nurses: {(error as Error)?.message || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Nurses Management"
        description="Manage and monitor nurse registrations and verifications"
      >
        {canCreateNurse && (
          <Button onClick={() => router.push("/admin/nurses/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Nurse
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
                data={nursesData?.nurses || []}
                totalItems={nursesData?.totalItems}
                currentPage={nursesData?.currentPage}
                totalPages={nursesData?.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
