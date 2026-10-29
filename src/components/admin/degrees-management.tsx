"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { baseUrl } from "@/config/config";
import "./degrees-management.css";
import { NativeSelect } from "@/components/ui/native-select";
import { AdminHeader } from "@/components/admin/admin-header";

interface DegreeType {
  value: string;
  displayName: string;
  banglaName: string;
}

interface Degree {
  id: number;
  name: string;
  abbreviation: string;
  degreeType: DegreeType;
}

const ITEMS_PER_PAGE = 15;

const DegreesManagement: React.FC = () => {
  const [data, setData] = useState<Degree[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterByType, setFilterByType] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/degrees`);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load degrees data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique degree types for filter
  const degreeTypes = Array.from(
    new Set(data.map((degree) => degree.degreeType.value))
  ).map((value) => {
    const degreeType = data.find(
      (d) => d.degreeType.value === value
    )?.degreeType;
    return degreeType!;
  });

  // Filter and paginate data
  const getFilteredAndPaginatedData = () => {
    const filteredData = data.filter((degree) => {
      const matchesSearch =
        degree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.degreeType.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        degree.degreeType.banglaName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        !filterByType || degree.degreeType.value === filterByType;

      return matchesSearch && matchesType;
    });

    // Paginate filtered data
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE),
      currentPage: currentPage,
    };
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTypeFilter = (type: string) => {
    setFilterByType(type);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderPagination = (
    totalPages: number,
    currentPage: number,
    totalItems: number
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({totalItems} total degrees)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const paginationData = getFilteredAndPaginatedData();

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader
        title="Degrees Management"
        description="Medical degrees and their abbreviations"
      >
        <Button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </AdminHeader>

      <div className="p-6">
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search degrees, abbreviations, or types..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Degree Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Filter by Type:
          </span>
          <NativeSelect
            value={filterByType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="h-9 w-auto"
          >
            <option value="">All Types</option>
            {degreeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.banglaName} ({type.displayName})
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{data.length}</div>
          <div className="text-sm text-muted-foreground">Total Degrees</div>
        </Card>

        {degreeTypes.map((type) => {
          const count = data.filter(
            (d) => d.degreeType.value === type.value
          ).length;
          return (
            <Card key={type.value} className="p-4">
              <div className="text-2xl font-bold text-success">{count}</div>
              <div className="text-sm text-muted-foreground">{type.banglaName}</div>
            </Card>
          );
        })}
      </div>

      {/* Content */}
      <Card className="p-6">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-muted-foreground">Loading degrees...</div>
          </div>
        )}

        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <strong>Showing:</strong> {paginationData.data.length} of{" "}
                {paginationData.totalItems} degrees
                {searchTerm && (
                  <span className="ml-2 text-primary">
                    (filtered by &quot;{searchTerm}&quot;)
                  </span>
                )}
                {filterByType && (
                  <span className="ml-2 text-success">
                    (type:{" "}
                    {
                      degreeTypes.find((t) => t.value === filterByType)
                        ?.banglaName
                    }
                    )
                  </span>
                )}
              </div>
            </div>

            {paginationData.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-input">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-input px-4 py-3 text-left font-medium">
                          ID
                        </th>
                        <th className="border border-input px-4 py-3 text-left font-medium">
                          Degree Name
                        </th>
                        <th className="border border-input px-4 py-3 text-left font-medium">
                          Abbreviation
                        </th>
                        <th className="border border-input px-4 py-3 text-left font-medium">
                          Degree Type
                        </th>
                        <th className="border border-input px-4 py-3 text-left font-medium">
                          Type (Bengali)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginationData.data.map((degree) => (
                        <tr key={degree.id} className="hover:bg-muted">
                          <td className="border border-input px-4 py-3 text-center">
                            <Badge variant="outline">{degree.id}</Badge>
                          </td>
                          <td className="border border-input px-4 py-3">
                            <div className="font-medium text-foreground">
                              {degree.name}
                            </div>
                          </td>
                          <td className="border border-input px-4 py-3">
                            <code className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                              {degree.abbreviation}
                            </code>
                          </td>
                          <td className="border border-input px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium">
                                {degree.degreeType.banglaName}
                              </div>
                              <div className="text-muted-foreground">
                                {degree.degreeType.value}
                              </div>
                            </div>
                          </td>
                          <td className="border border-input px-4 py-3">
                            <span className="text-muted-foreground">
                              {degree.degreeType.displayName}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination(
                  paginationData.totalPages,
                  paginationData.currentPage,
                  paginationData.totalItems
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || filterByType
                  ? "No degrees found matching your criteria"
                  : "No degrees available"}
              </div>
            )}
          </>
        )}
      </Card>
      </div>
    </div>
  );
};

export default DegreesManagement;
