"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Database, List, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./constants-management.css";

interface ListItem {
  value: string;
  displayName?: string;
  bnName?: string;
  banglaName?: string;
  description?: string;
  label?: string;
  startAge?: number;
  endAge?: number;
  minDonations?: number;
  maxDonations?: number;
  icon?: string;
  levelName?: string;
}

interface ApiConfig {
  name: string;
  endpoint: string;
  title: string;
  category: string;
}

const API_CONFIGS: ApiConfig[] = [
  {
    name: "associationTypes",
    endpoint: "/api/association-types",
    title: "Association Types",
    category: "General",
  },
  {
    name: "ambulanceTypes",
    endpoint: "/api/ambulance-types",
    title: "Ambulance Types",
    category: "Medical",
  },
  {
    name: "degreeTypes",
    endpoint: "/api/degree-types",
    title: "Degree Types",
    category: "Education",
  },
  {
    name: "ageGroups",
    endpoint: "/api/age-groups",
    title: "Age Groups",
    category: "Demographics",
  },
  {
    name: "bloodDonationBadges",
    endpoint: "/api/blood-donation-badges",
    title: "Blood Donation Badges",
    category: "Blood Bank",
  },
  {
    name: "hospitalAmenityTypes",
    endpoint: "/api/hospital-amenity-types",
    title: "Hospital Amenity Types",
    category: "Medical",
  },
  {
    name: "hospitalTypes",
    endpoint: "/api/hospital-types",
    title: "Hospital Types",
    category: "Medical",
  },
  {
    name: "bloodGroups",
    endpoint: "/api/blood-groups",
    title: "Blood Groups",
    category: "Blood Bank",
  },
  {
    name: "doctorBadges",
    endpoint: "/api/doctor-badges",
    title: "Doctor Badges",
    category: "Medical",
  },
  {
    name: "organizationTypes",
    endpoint: "/api/organization-types",
    title: "Organization Types",
    category: "General",
  },
  {
    name: "permissions",
    endpoint: "/api/permissions",
    title: "Permissions",
    category: "Security",
  },
  {
    name: "userTypes",
    endpoint: "/api/user-types",
    title: "User Types",
    category: "Security",
  },
  {
    name: "teacherPositions",
    endpoint: "/api/teacher-positions",
    title: "Teacher Positions",
    category: "Education",
  },
  {
    name: "socialOrganizationTypes",
    endpoint: "/api/social-organization-types",
    title: "Social Organization Types",
    category: "General",
  },
];

const ConstantsManagement: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiConfig>(API_CONFIGS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Record<string, ListItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  // Group APIs by category
  const groupedApis = API_CONFIGS.reduce((acc, api) => {
    if (!acc[api.category]) acc[api.category] = [];
    acc[api.category].push(api);
    return acc;
  }, {} as Record<string, ApiConfig[]>);

  // Filter APIs based on search
  const filteredApis = API_CONFIGS.filter(
    (api) =>
      api.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchData = useCallback(
    async (config: ApiConfig) => {
      if (data[config.name]) return;

      setLoading((prev) => ({ ...prev, [config.name]: true }));
      setError((prev) => ({ ...prev, [config.name]: "" }));

      try {
        const response = await fetch(
          `https://api.opencarebd.com${config.endpoint}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData((prev) => ({ ...prev, [config.name]: result }));
      } catch {
        setError((prev) => ({ ...prev, [config.name]: "Failed to load data" }));
      } finally {
        setLoading((prev) => ({ ...prev, [config.name]: false }));
      }
    },
    [data]
  );

  const refreshData = async (config: ApiConfig) => {
    // Clear existing data to force refresh
    setData((prev) => {
      const newData = { ...prev };
      delete newData[config.name];
      return newData;
    });
    await fetchData(config);
  };

  useEffect(() => {
    fetchData(selectedApi);
  }, [selectedApi, fetchData]);

  const renderSidebarItem = (api: ApiConfig) => (
    <div
      key={api.name}
      className={`constants-sidebar-item p-3 cursor-pointer border-b border-gray-200 ${
        selectedApi.name === api.name ? "active" : ""
      }`}
      onClick={() => setSelectedApi(api)}
    >
      <div className="flex items-center">
        <List className="mr-2 h-4 w-4" />
        <div className="flex-1">
          <div className="font-medium text-sm">{api.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {data[api.name]?.length || 0} items
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (items: ListItem[]) => {
    // Determine columns based on data structure
    const hasDisplayName = items.some((item) => item.displayName);
    const hasBnName = items.some((item) => item.bnName);
    const hasBanglaName = items.some((item) => item.banglaName);
    const hasDescription = items.some((item) => item.description);
    const hasLabel = items.some((item) => item.label);
    const hasAgeRange = items.some(
      (item) => item.startAge !== undefined && item.endAge !== undefined
    );
    const hasIcon = items.some((item) => item.icon);
    const hasLevelName = items.some((item) => item.levelName);
    const hasDonationRange = items.some(
      (item) =>
        item.minDonations !== undefined && item.maxDonations !== undefined
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                Value
              </th>
              {hasIcon && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Icon
                </th>
              )}
              {hasLevelName && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Level Name
                </th>
              )}
              {hasLabel && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Label
                </th>
              )}
              {hasDisplayName && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Display Name
                </th>
              )}
              {hasBnName && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Bengali Name
                </th>
              )}
              {hasBanglaName && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Bangla Name
                </th>
              )}
              {hasDonationRange && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Donation Range
                </th>
              )}
              {hasAgeRange && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Age Range
                </th>
              )}
              {hasDescription && (
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                  Description
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {item.value}
                  </code>
                </td>
                {hasIcon && (
                  <td className="border border-gray-300 px-4 py-2 text-center text-lg">
                    {item.icon || "-"}
                  </td>
                )}
                {hasLevelName && (
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {item.levelName || "-"}
                  </td>
                )}
                {hasLabel && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.label || "-"}
                  </td>
                )}
                {hasDisplayName && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.displayName || "-"}
                  </td>
                )}
                {hasBnName && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.bnName || "-"}
                  </td>
                )}
                {hasBanglaName && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.banglaName || "-"}
                  </td>
                )}
                {hasDonationRange && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.minDonations !== undefined &&
                    item.maxDonations !== undefined
                      ? `${item.minDonations} - ${
                          item.maxDonations === 2147483647
                            ? "∞"
                            : item.maxDonations
                        }`
                      : "-"}
                  </td>
                )}
                {hasAgeRange && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.startAge !== undefined && item.endAge !== undefined
                      ? `${item.startAge} - ${item.endAge}`
                      : "-"}
                  </td>
                )}
                {hasDescription && (
                  <td className="border border-gray-300 px-4 py-2">
                    {item.description || "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div className="constants-sidebar w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Database className="mr-2 h-5 w-5" />
            <h2 className="text-lg font-semibold">Constants</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search constants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            // Show filtered results
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-500">
                Search Results ({filteredApis.length})
              </div>
              {filteredApis.map(renderSidebarItem)}
            </div>
          ) : (
            // Show grouped results
            Object.entries(groupedApis).map(([category, apis]) => (
              <div key={category} className="mb-4">
                <div className="constants-category-header px-3 py-2 text-sm font-medium">
                  {category}
                </div>
                {apis.map(renderSidebarItem)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="constants-main-content flex-1 p-6">
        <div className="flex justify-content-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{selectedApi.title}</h1>
            <p className="text-sm text-gray-600">
              Endpoint:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {selectedApi.endpoint}
              </code>
            </p>
          </div>
          <Button
            onClick={() => refreshData(selectedApi)}
            disabled={loading[selectedApi.name]}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading[selectedApi.name] ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          {loading[selectedApi.name] && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">
                Loading {selectedApi.title}...
              </div>
            </div>
          )}

          {error[selectedApi.name] && (
            <Alert className="mb-4">
              <AlertDescription>{error[selectedApi.name]}</AlertDescription>
            </Alert>
          )}

          {data[selectedApi.name] && !loading[selectedApi.name] && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <strong>Total Records:</strong>{" "}
                  {data[selectedApi.name].length}
                </div>
              </div>

              {data[selectedApi.name].length > 0 ? (
                renderTable(data[selectedApi.name])
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConstantsManagement;
