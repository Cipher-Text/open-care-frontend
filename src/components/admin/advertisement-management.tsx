"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAdvertisementTypes, getAdvertisements } from "@/api/advertisements";
import { AdvertisementType, Advertisement } from "@/types/advertisements";
import "./advertisement-management.css";

type TabType = "types" | "advertisements";

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: "types", label: "Advertisement Types", icon: "📋" },
  { id: "advertisements", label: "Advertisements", icon: "📢" },
];

const AdvertisementManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("types");
  const [types, setTypes] = useState<AdvertisementType[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [typesPage, setTypesPage] = useState(0);
  const [typesTotalPages, setTypesTotalPages] = useState(0);
  const [typesTotalItems, setTypesTotalItems] = useState(0);

  const [adsPage, setAdsPage] = useState(0);
  const [adsTotalPages, setAdsTotalPages] = useState(0);
  const [adsTotalItems, setAdsTotalItems] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    if (activeTab === "types") {
      fetchTypes(typesPage);
    } else {
      fetchAdvertisements(adsPage);
    }
  }, [activeTab, typesPage, adsPage]);

  const fetchTypes = async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdvertisementTypes(page, pageSize);
      setTypes(response.types);
      setTypesTotalPages(response.totalPages);
      setTypesTotalItems(response.totalItems);
    } catch (err) {
      setError("Failed to load advertisement types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdvertisements(page, pageSize);
      setAdvertisements(response.advertisements);
      setAdsTotalPages(response.totalPages);
      setAdsTotalItems(response.totalItems);
    } catch (err) {
      setError("Failed to load advertisements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "types") {
      fetchTypes(typesPage);
    } else {
      fetchAdvertisements(adsPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "types") {
      setTypesPage(page);
    } else {
      setAdsPage(page);
    }
  };

  const filteredTypes = types.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.position.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdvertisements = advertisements.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.advertisementType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTypesTable = () => (
    <div className="advertisement-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Position</th>
            <th>Base Price</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {filteredTypes.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td className="font-medium">{type.name}</td>
              <td className="max-w-xs">{type.description}</td>
              <td>
                <span className="position-badge">{type.position.position}</span>
              </td>
              <td className="font-semibold">
                ৳{type.basePrice.toLocaleString()}
              </td>
              <td>{type.durationInDays} days</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTypes.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No advertisement types found
        </div>
      )}
    </div>
  );

  const renderAdvertisementsTable = () => (
    <div className="advertisement-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>Target</th>
            <th>Location</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Stats</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvertisements.map((ad) => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="advertisement-image object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.png";
                    }}
                  />
                </div>
              </td>
              <td>
                <div className="font-medium">{ad.title}</div>
                <div className="text-xs text-gray-500 mt-1">{ad.content}</div>
              </td>
              <td>
                <div className="text-sm">{ad.advertisementType.name}</div>
                <span className="position-badge mt-1">
                  {ad.advertisementType.position.position}
                </span>
              </td>
              <td>
                <a
                  href={ad.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="advertisement-link"
                >
                  {ad.targetType} #{ad.targetId}
                </a>
              </td>
              <td>
                <div className="text-sm">
                  <div>{ad.district.name}</div>
                  {ad.upazila && (
                    <div className="text-xs text-gray-500">
                      {ad.upazila.name}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="text-xs">
                  <div>From: {new Date(ad.startTime).toLocaleDateString()}</div>
                  <div>To: {new Date(ad.endTime).toLocaleDateString()}</div>
                </div>
              </td>
              <td>
                <Badge
                  className={ad.isActive ? "badge-active" : "badge-inactive"}
                >
                  {ad.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>
                <div className="advertisement-stats">
                  <div className="stat-item">
                    <span className="stat-label">Views</span>
                    <span className="stat-value flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {ad.views}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Clicks</span>
                    <span className="stat-value flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {ad.clicks}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredAdvertisements.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No advertisements found
        </div>
      )}
    </div>
  );

  const currentPage = activeTab === "types" ? typesPage : adsPage;
  const totalPages = activeTab === "types" ? typesTotalPages : adsTotalPages;
  const totalItems = activeTab === "types" ? typesTotalItems : adsTotalItems;
  const currentItems =
    activeTab === "types"
      ? filteredTypes.length
      : filteredAdvertisements.length;

  return (
    <div className="advertisement-management">
      <div className="advertisement-header">
        <h1>📢 Advertisement Management</h1>
        <p>Manage advertisement types and active advertisements</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="advertisement-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`advertisement-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="advertisement-controls">
        <div className="advertisement-search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={`Search ${
                activeTab === "types" ? "types" : "advertisements"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card className="advertisement-content">
        {loading && currentItems === 0 ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "types"
              ? renderTypesTable()
              : renderAdvertisementsTable()}

            {totalPages > 1 && (
              <div className="advertisement-pagination">
                <div className="pagination-info">
                  Showing {currentPage * pageSize + 1} to{" "}
                  {Math.min((currentPage + 1) * pageSize, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <div className="pagination-controls">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="page-number">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || loading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AdvertisementManagement;
