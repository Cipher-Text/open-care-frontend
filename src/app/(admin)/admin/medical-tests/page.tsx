"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchMedicalTests } from "@/api/medical-tests";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MedicalTestsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState<"ASC" | "DESC">("ASC");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["medical-tests", page, pageSize, sort, direction, searchTerm],
    queryFn: () =>
      fetchMedicalTests({
        page: page - 1, // Convert to 0-based for API
        size: pageSize,
        sort,
        direction,
        name: searchTerm || undefined,
      }),
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSortChange = useCallback(
    (newSort: string, newDirection: "ASC" | "DESC") => {
      setSort(newSort);
      setDirection(newDirection);
    },
    []
  );

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setPage(1); // Reset to first page when searching
  }, []);

  const medicalTests = data?.medicalTests || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medical Tests</h1>
          <p className="text-muted-foreground">
            Manage medical tests and diagnostic procedures.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Medical Test
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={medicalTests}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        sort={sort}
        direction={direction}
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
