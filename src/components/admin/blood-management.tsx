"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Droplets,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { baseUrl } from "@/config/config";
import "./blood-management.css";

// Common interfaces
interface BloodGroup {
  value: string;
  displayName: string;
  bnName: string;
}

interface Gender {
  value: string;
  displayName: string;
  banglaName: string;
}

interface LocationUnit {
  id: number;
  name: string;
  bnName: string;
}

interface District {
  id: number;
  name: string;
  bnName: string;
  lat: string;
  lon: string;
  url: string;
  division: {
    id: number;
    name: string;
    bnName: string;
    url: string;
  };
}

interface Hospital {
  id: number;
  name: string;
  bnName: string;
  numberOfBed: number;
  district: District;
  hospitalType: {
    value: string;
    banglaName: string;
    englishName: string;
  };
  organizationType: {
    value: string;
    displayName: string;
    banglaName: string;
    description: string;
  };
  websiteUrl: string;
}

// Donor interfaces
interface BloodDonor {
  id: number;
  name: string;
  bnName: string;
  phone: string;
  email: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  address: string;
  district: District;
  upazila: LocationUnit | null;
  union: LocationUnit | null;
  bloodDonationCount: number;
  lastBloodDonationDate: string;
  imageUrl: string;
  isActive: boolean;
}

interface DonorResponse {
  totalItems: number;
  totalPages: number;
  donors: BloodDonor[];
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
}

// Donation interfaces
interface BloodDonation {
  id: number;
  donor: {
    id: number;
    name: string;
    bnName: string;
    phone: string;
    email: string;
    district: District;
  };
  hospital: Hospital;
  donationDate: string;
  bloodGroup: BloodGroup;
  quantityMl: number;
  bloodComponent: {
    value: string;
    displayName: string;
    bnName: string;
  };
}

interface DonationResponse {
  totalItems: number;
  donations: BloodDonation[];
  totalPages: number;
  currentPage: number;
}

// Requisition interfaces
interface BloodRequisition {
  id: number;
  requester: {
    id: number;
    name: string;
    bnName: string;
    phone: string;
    email: string;
    district: District;
  };
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  bloodGroup: BloodGroup;
  bloodComponent: {
    value: string;
    displayName: string;
    bnName: string;
  };
  quantityBags: number;
  neededByDate: string;
  hospital: Hospital;
  contactPerson: string;
  contactPhone: string;
  description: string;
  district: District;
  status: string;
  fulfilledDate: string;
}

interface RequisitionResponse {
  totalItems: number;
  requisitions: BloodRequisition[];
  totalPages: number;
  currentPage: number;
}

interface TabConfig {
  name: string;
  title: string;
  icon: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { name: "donors", title: "Donors", icon: "🩸" },
  { name: "requisitions", title: "Requisitions", icon: "📋" },
  { name: "donations", title: "Donations", icon: "🎁" },
];

const ITEMS_PER_PAGE = 10;

const BloodManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TAB_CONFIGS[0].name);
  const [donorData, setDonorData] = useState<DonorResponse | null>(null);
  const [donationData, setDonationData] = useState<DonationResponse | null>(
    null
  );
  const [requisitionData, setRequisitionData] =
    useState<RequisitionResponse | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    donors: 0,
    donations: 0,
    requisitions: 0,
  });

  const fetchDonors = useCallback(async (page: number) => {
    setLoading((prev) => ({ ...prev, donors: true }));
    setError((prev) => ({ ...prev, donors: "" }));

    try {
      const response = await fetch(
        `${baseUrl}/blood-donors?page=${page}&size=${ITEMS_PER_PAGE}&sortBy=bloodDonationCount&sortDir=desc`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setDonorData(result);
    } catch {
      setError((prev) => ({ ...prev, donors: "Failed to load donors data" }));
    } finally {
      setLoading((prev) => ({ ...prev, donors: false }));
    }
  }, []);

  const fetchDonations = useCallback(async (page: number) => {
    setLoading((prev) => ({ ...prev, donations: true }));
    setError((prev) => ({ ...prev, donations: "" }));

    try {
      const response = await fetch(
        `${baseUrl}/blood-donations?page=${page}&size=${ITEMS_PER_PAGE}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setDonationData(result);
    } catch {
      setError((prev) => ({
        ...prev,
        donations: "Failed to load donations data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, donations: false }));
    }
  }, []);

  const fetchRequisitions = useCallback(async (page: number) => {
    setLoading((prev) => ({ ...prev, requisitions: true }));
    setError((prev) => ({ ...prev, requisitions: "" }));

    try {
      const response = await fetch(
        `${baseUrl}/blood-requisitions?page=${page}&size=${ITEMS_PER_PAGE}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setRequisitionData(result);
    } catch {
      setError((prev) => ({
        ...prev,
        requisitions: "Failed to load requisitions data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, requisitions: false }));
    }
  }, []);

  const fetchData = useCallback(
    (tab: string, page: number) => {
      switch (tab) {
        case "donors":
          fetchDonors(page);
          break;
        case "donations":
          fetchDonations(page);
          break;
        case "requisitions":
          fetchRequisitions(page);
          break;
      }
    },
    [fetchDonors, fetchDonations, fetchRequisitions]
  );

  useEffect(() => {
    const page = currentPage[activeTab] || 0;
    fetchData(activeTab, page);
  }, [activeTab, fetchData, currentPage]);

  const handlePageChange = (tab: string, newPage: number) => {
    setCurrentPage((prev) => ({ ...prev, [tab]: newPage }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const refreshData = () => {
    const page = currentPage[activeTab] || 0;
    fetchData(activeTab, page);
  };

  // Filter data based on search term
  const getFilteredData = () => {
    let data: (BloodDonor | BloodDonation | BloodRequisition)[] = [];
    let totalItems = 0;
    let totalPages = 0;
    let currentPageNum = 0;

    switch (activeTab) {
      case "donors":
        if (donorData) {
          data = donorData.donors;
          totalItems = donorData.totalItems;
          totalPages = donorData.totalPages;
          currentPageNum = donorData.currentPage;
        }
        break;
      case "donations":
        if (donationData) {
          data = donationData.donations;
          totalItems = donationData.totalItems;
          totalPages = donationData.totalPages;
          currentPageNum = donationData.currentPage;
        }
        break;
      case "requisitions":
        if (requisitionData) {
          data = requisitionData.requisitions;
          totalItems = requisitionData.totalItems;
          totalPages = requisitionData.totalPages;
          currentPageNum = requisitionData.currentPage;
        }
        break;
    }

    // Apply client-side search filter
    if (searchTerm) {
      data = data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        if (activeTab === "donors") {
          const donor = item as BloodDonor;
          return (
            donor.name?.toLowerCase().includes(searchLower) ||
            donor.bnName?.toLowerCase().includes(searchLower) ||
            donor.phone?.toLowerCase().includes(searchLower) ||
            donor.bloodGroup?.displayName?.toLowerCase().includes(searchLower)
          );
        } else if (activeTab === "donations") {
          const donation = item as BloodDonation;
          return (
            donation.donor?.name?.toLowerCase().includes(searchLower) ||
            donation.hospital?.name?.toLowerCase().includes(searchLower) ||
            donation.bloodComponent?.bnName?.toLowerCase().includes(searchLower)
          );
        } else if (activeTab === "requisitions") {
          const requisition = item as BloodRequisition;
          return (
            requisition.patientName?.toLowerCase().includes(searchLower) ||
            requisition.requester?.name?.toLowerCase().includes(searchLower) ||
            requisition.hospital?.name?.toLowerCase().includes(searchLower) ||
            requisition.contactPerson?.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    }

    return { data, totalItems, totalPages, currentPage: currentPageNum };
  };

  const renderPagination = (
    totalPages: number,
    currentPageNum: number,
    totalItems: number
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Page {currentPageNum + 1} of {totalPages} ({totalItems} total items)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(activeTab, currentPageNum - 1)}
            disabled={currentPageNum <= 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPageNum <= 2) {
                pageNum = i;
              } else if (currentPageNum >= totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPageNum - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPageNum === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(activeTab, pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(activeTab, currentPageNum + 1)}
            disabled={currentPageNum >= totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDonorsTable = (donors: BloodDonor[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              ID
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Name
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Blood Group
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Gender
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Contact
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Location
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Donations
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant="outline">{donor.id}</Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-sm text-gray-500">{donor.bnName}</div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {donor.bloodGroup?.displayName}
                </Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {donor.gender?.banglaName}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div className="text-sm">
                  {donor.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {donor.phone}
                    </div>
                  )}
                  {donor.email && (
                    <div className="text-gray-500">{donor.email}</div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                {donor.district && (
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <div>
                      <div>{donor.district.name}</div>
                      <div className="text-gray-500">
                        {donor.district.bnName}
                      </div>
                    </div>
                  </div>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <div>
                  <div className="font-bold text-lg">
                    {donor.bloodDonationCount || 0}
                  </div>
                  {donor.lastBloodDonationDate && (
                    <div className="text-xs text-gray-500">
                      Last:{" "}
                      {new Date(
                        donor.lastBloodDonationDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant={donor.isActive ? "default" : "secondary"}>
                  {donor.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDonationsTable = (donations: BloodDonation[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              ID
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Donor
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Hospital
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Date
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Component
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant="outline">{donation.id}</Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">{donation.donor?.name}</div>
                  <div className="text-sm text-gray-500">
                    {donation.donor?.bnName}
                  </div>
                  {donation.donor?.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {donation.donor.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">{donation.hospital?.name}</div>
                  <div className="text-sm text-gray-500">
                    {donation.hospital?.bnName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {donation.hospital?.district?.name}
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(donation.donationDate).toLocaleDateString()}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {donation.bloodComponent?.bnName}
                </Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <div className="font-bold">{donation.quantityMl} ml</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRequisitionsTable = (requisitions: BloodRequisition[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              ID
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Patient
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Requester
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Hospital
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Component
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Quantity
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Needed By
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">
              Contact
            </th>
          </tr>
        </thead>
        <tbody>
          {requisitions.map((requisition) => (
            <tr key={requisition.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant="outline">{requisition.id}</Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">{requisition.patientName}</div>
                  <div className="text-sm text-gray-500">
                    Age: {requisition.patientAge},{" "}
                    {requisition.patientGender?.banglaName}
                  </div>
                  {requisition.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {requisition.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">
                    {requisition.requester?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {requisition.requester?.bnName}
                  </div>
                  {requisition.requester?.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {requisition.requester.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">
                    {requisition.hospital?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {requisition.hospital?.bnName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {requisition.hospital?.district?.name}
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {requisition.bloodComponent?.bnName}
                </Badge>
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <div className="font-bold">{requisition.quantityBags} bags</div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div>
                      {new Date(requisition.neededByDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.ceil(
                        (new Date(requisition.neededByDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days left
                    </div>
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <div>
                  <div className="font-medium">{requisition.contactPerson}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3" />
                    {requisition.contactPhone}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const filteredData = getFilteredData();
  const activeConfig = TAB_CONFIGS.find((config) => config.name === activeTab);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Droplets className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Blood Management</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeConfig?.title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Button
            onClick={refreshData}
            disabled={loading[activeTab]}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading[activeTab] ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {TAB_CONFIGS.map((config) => (
              <button
                key={config.name}
                onClick={() => handleTabChange(config.name)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === config.name
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{config.icon}</span>
                {config.title}
                <Badge variant="secondary" className="ml-1">
                  {filteredData.totalItems}
                </Badge>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <Card className="p-6">
        {loading[activeTab] && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <div className="text-gray-600">
              Loading {activeConfig?.title.toLowerCase()}...
            </div>
          </div>
        )}

        {error[activeTab] && (
          <Alert className="mb-4">
            <AlertDescription>{error[activeTab]}</AlertDescription>
          </Alert>
        )}

        {!loading[activeTab] && !error[activeTab] && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <strong>Showing:</strong> {filteredData.data.length} of{" "}
                {filteredData.totalItems} {activeConfig?.title.toLowerCase()}
                {searchTerm && (
                  <span className="ml-2 text-red-600">
                    (filtered by &quot;{searchTerm}&quot;)
                  </span>
                )}
              </div>
            </div>

            {filteredData.data.length > 0 ? (
              <>
                {activeTab === "donors" &&
                  renderDonorsTable(filteredData.data as BloodDonor[])}
                {activeTab === "donations" &&
                  renderDonationsTable(filteredData.data as BloodDonation[])}
                {activeTab === "requisitions" &&
                  renderRequisitionsTable(
                    filteredData.data as BloodRequisition[]
                  )}
                {renderPagination(
                  filteredData.totalPages,
                  filteredData.currentPage,
                  filteredData.totalItems
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? `No results found for &quot;${searchTerm}&quot;`
                  : `No ${activeConfig?.title.toLowerCase()} available`}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default BloodManagement;
