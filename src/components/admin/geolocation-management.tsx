"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import "./geolocation-management.css";
import { AdminHeader } from "@/components/admin/admin-header";

interface Division {
  id: number;
  name: string;
  bnName: string;
  url: string;
}

interface District {
  id: number;
  division: Division;
  name: string;
  bnName: string;
  lat: string;
  lon: string;
  url: string;
}

interface Upazila {
  id: number;
  district: District;
  name: string;
  bnName: string;
  url: string;
}

type GeolocationData = Division | District | Upazila;

interface ApiConfig {
  name: string;
  endpoint: string;
  title: string;
  icon: string;
}

const API_CONFIGS: ApiConfig[] = [
  {
    name: "divisions",
    endpoint: "/divisions",
    title: "Divisions",
    icon: "🏛️",
  },
  {
    name: "districts",
    endpoint: "/districts",
    title: "Districts",
    icon: "🏢",
  },
  {
    name: "upazilas",
    endpoint: "/upazilas",
    title: "Upazilas",
    icon: "🏘️",
  },
];

interface PaginationData {
  data: GeolocationData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const ITEMS_PER_PAGE = 10;

const GeolocationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(API_CONFIGS[0].name);
  const [data, setData] = useState<Record<string, GeolocationData[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  const fetchData = useCallback(
    async (config: ApiConfig) => {
      if (data[config.name]) return;

      setLoading((prev) => ({ ...prev, [config.name]: true }));
      setError((prev) => ({ ...prev, [config.name]: "" }));

      try {
        const response = await fetch(`${baseUrl}${config.endpoint}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData((prev) => ({ ...prev, [config.name]: result }));
        setCurrentPage((prev) => ({ ...prev, [config.name]: 1 }));
      } catch {
        setError((prev) => ({ ...prev, [config.name]: "Failed to load data" }));
      } finally {
        setLoading((prev) => ({ ...prev, [config.name]: false }));
      }
    },
    [data]
  );

  const refreshData = async (config: ApiConfig) => {
    setData((prev) => {
      const newData = { ...prev };
      delete newData[config.name];
      return newData;
    });
    await fetchData(config);
  };

  useEffect(() => {
    const activeConfig = API_CONFIGS.find(
      (config) => config.name === activeTab
    );
    if (activeConfig) {
      fetchData(activeConfig);
    }
  }, [activeTab, fetchData]);

  // Filter and paginate data
  const getFilteredAndPaginatedData = (apiName: string) => {
    const apiData = data[apiName] || [];
    const page = currentPage[apiName] || 1;

    // Filter data based on search term
    const filteredData = apiData.filter((item: GeolocationData) => {
      const baseMatch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bnName.toLowerCase().includes(searchTerm.toLowerCase());

      if ("division" in item && item.division) {
        return (
          baseMatch ||
          item.division.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if ("district" in item && item.district) {
        return (
          baseMatch ||
          item.district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.district.division.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      return baseMatch;
    });

    // Paginate filtered data
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE),
      currentPage: page,
    };
  };

  const handlePageChange = (apiName: string, newPage: number) => {
    setCurrentPage((prev) => ({ ...prev, [apiName]: newPage }));
  };

  const renderDivisionsTable = (divisions: Division[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-input">
        <thead>
          <tr className="bg-muted">
            <th className="border border-input px-4 py-2 text-left font-medium">
              ID
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Bengali Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {divisions.map((item) => (
            <tr key={item.id} className="hover:bg-muted">
              <td className="border border-input px-4 py-2">{item.id}</td>
              <td className="border border-input px-4 py-2 font-medium">
                {item.name}
              </td>
              <td className="border border-input px-4 py-2">
                {item.bnName}
              </td>
              <td className="border border-input px-4 py-2">
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {item.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDistrictsTable = (districts: District[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-input">
        <thead>
          <tr className="bg-muted">
            <th className="border border-input px-4 py-2 text-left font-medium">
              ID
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Bengali Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Division
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Coordinates
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {districts.map((item) => (
            <tr key={item.id} className="hover:bg-muted">
              <td className="border border-input px-4 py-2">{item.id}</td>
              <td className="border border-input px-4 py-2 font-medium">
                {item.name}
              </td>
              <td className="border border-input px-4 py-2">
                {item.bnName}
              </td>
              <td className="border border-input px-4 py-2">
                <div className="text-sm">
                  <div className="font-medium">{item.division.name}</div>
                  <div className="text-muted-foreground">{item.division.bnName}</div>
                </div>
              </td>
              <td className="border border-input px-4 py-2">
                <div className="text-sm">
                  <div>Lat: {parseFloat(item.lat).toFixed(4)}</div>
                  <div>Lon: {parseFloat(item.lon).toFixed(4)}</div>
                </div>
              </td>
              <td className="border border-input px-4 py-2">
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {item.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUpazilasTable = (upazilas: Upazila[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-input">
        <thead>
          <tr className="bg-muted">
            <th className="border border-input px-4 py-2 text-left font-medium">
              ID
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Bengali Name
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              District
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              Division
            </th>
            <th className="border border-input px-4 py-2 text-left font-medium">
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {upazilas.map((item) => (
            <tr key={item.id} className="hover:bg-muted">
              <td className="border border-input px-4 py-2">{item.id}</td>
              <td className="border border-input px-4 py-2 font-medium">
                {item.name}
              </td>
              <td className="border border-input px-4 py-2">
                {item.bnName}
              </td>
              <td className="border border-input px-4 py-2">
                <div className="text-sm">
                  <div className="font-medium">{item.district.name}</div>
                  <div className="text-muted-foreground">{item.district.bnName}</div>
                </div>
              </td>
              <td className="border border-input px-4 py-2">
                <div className="text-sm">
                  <div className="font-medium">
                    {item.district.division.name}
                  </div>
                  <div className="text-muted-foreground">
                    {item.district.division.bnName}
                  </div>
                </div>
              </td>
              <td className="border border-input px-4 py-2">
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {item.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTable = (apiName: string, items: GeolocationData[]) => {
    switch (apiName) {
      case "divisions":
        return renderDivisionsTable(items as Division[]);
      case "districts":
        return renderDistrictsTable(items as District[]);
      case "upazilas":
        return renderUpazilasTable(items as Upazila[]);
      default:
        return <div>Unknown data type</div>;
    }
  };

  const renderPagination = (apiName: string, pagination: PaginationData) => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({pagination.totalItems} total
          items)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(apiName, currentPage - 1)}
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
                  onClick={() => handlePageChange(apiName, pageNum)}
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
            onClick={() => handlePageChange(apiName, currentPage + 1)}
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

  const activeConfig = API_CONFIGS.find((config) => config.name === activeTab);
  const paginationData = activeConfig
    ? getFilteredAndPaginatedData(activeTab)
    : null;

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader
        title="Geolocation Management"
        description="Divisions, districts, upazilas and unions"
      >
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Reset to page 1 when searching
                if (activeConfig) {
                  setCurrentPage((prev) => ({
                    ...prev,
                    [activeConfig.name]: 1,
                  }));
                }
              }}
              className="pl-10 w-64"
            />
          </div>

          {activeConfig && (
            <Button
              onClick={() => refreshData(activeConfig)}
              disabled={loading[activeConfig.name]}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading[activeConfig.name] ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          )}
        </div>
      </AdminHeader>

      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {API_CONFIGS.map((config) => (
                <button
                  key={config.name}
                  onClick={() => {
                    setActiveTab(config.name);
                    setSearchTerm(""); // Clear search when switching tabs
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === config.name
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-muted-foreground hover:border-input"
                  }`}
                >
                  <span className="text-lg">{config.icon}</span>
                  {config.title}
                  {data[config.name] && (
                    <Badge variant="secondary" className="ml-1">
                      {data[config.name].length}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6">
          {activeConfig && (
            <>
              {loading[activeConfig.name] && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <div className="text-muted-foreground">
                    Loading {activeConfig.title}...
                  </div>
                </div>
              )}

              {error[activeConfig.name] && (
                <Alert className="mb-4">
                  <AlertDescription>{error[activeConfig.name]}</AlertDescription>
                </Alert>
              )}

              {paginationData && !loading[activeConfig.name] && (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <strong>Showing:</strong> {paginationData.data.length} of{" "}
                      {paginationData.totalItems}{" "}
                      {activeConfig.title.toLowerCase()}
                      {searchTerm && (
                        <span className="ml-2 text-primary">
                          (filtered by &quot;{searchTerm}&quot;)
                        </span>
                      )}
                    </div>
                  </div>

                  {paginationData.data.length > 0 ? (
                    <>
                      {renderTable(activeConfig.name, paginationData.data)}
                      {renderPagination(activeConfig.name, paginationData)}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm
                        ? `No results found for &quot;${searchTerm}&quot;`
                        : "No data available"}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GeolocationManagement;
