"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Users as UsersIcon,
  Heart,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfiles, ProfilesResponse } from "@/api/profile";
import { getUserSession } from "@/lib/auth-client";
import "./profile-management.css";

const ITEMS_PER_PAGE = 10;

const ProfileManagement: React.FC = () => {
  const [data, setData] = useState<ProfilesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterByUserType, setFilterByUserType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDir, setSortDir] = useState<string>("ASC");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const session = getUserSession();
      const token = session?.access_token;

      const response = await getProfiles(
        currentPage,
        ITEMS_PER_PAGE,
        sortBy,
        sortDir,
        token
      );
      setData(response);
    } catch (err) {
      setError("Failed to load profiles data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortDir]);

  // Get unique user types for filter
  const userTypes = data?.profiles
    ? Array.from(
        new Set(data.profiles.map((profile) => profile.userType.value))
      ).map((value) => {
        const userType = data.profiles.find(
          (p) => p.userType.value === value
        )?.userType;
        return userType!;
      })
    : [];

  // Filter data
  const getFilteredData = () => {
    if (!data) return [];

    return data.profiles.filter((profile) => {
      const matchesSearch =
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bnName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.userType.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        !filterByUserType || profile.userType.value === filterByUserType;

      return matchesSearch && matchesType;
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleUserTypeFilter = (type: string) => {
    setFilterByUserType(type);
  };

  const filteredData = getFilteredData();
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.totalItems || 0;

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages} ({totalItems} total profiles)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 0}
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
              } else if (currentPage <= 2) {
                pageNum = i;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 5 + i;
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
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-teal-600" />
          <h1 className="text-2xl font-bold">Profile Management</h1>
        </div>
        <Button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search profiles by name, phone, email, or user type..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* User Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Filter by Type:
          </span>
          <select
            value={filterByUserType}
            onChange={(e) => handleUserTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Types</option>
            {userTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.banglaName} ({type.displayName})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="userType">User Type</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDir(sortDir === "ASC" ? "DESC" : "ASC")}
          >
            {sortDir === "ASC" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-teal-600" />
            <div>
              <div className="text-2xl font-bold text-teal-600">
                {totalItems}
              </div>
              <div className="text-sm text-gray-600">Total Profiles</div>
            </div>
          </div>
        </Card>

        {userTypes.slice(0, 3).map((type) => {
          const count =
            data?.profiles.filter((p) => p.userType.value === type.value)
              .length || 0;
          return (
            <Card key={type.value} className="p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">{type.banglaName}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content */}
      <Card className="p-6">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading profiles...</div>
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
              <div className="text-sm text-gray-600">
                <strong>Showing:</strong> {filteredData.length} profiles
                {searchTerm && (
                  <span className="ml-2 text-teal-600">
                    (filtered by &quot;{searchTerm}&quot;)
                  </span>
                )}
                {filterByUserType && (
                  <span className="ml-2 text-blue-600">
                    (type:{" "}
                    {
                      userTypes.find((t) => t.value === filterByUserType)
                        ?.banglaName
                    }
                    )
                  </span>
                )}
              </div>
            </div>

            {filteredData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          Profile
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          User Type
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          Contact
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          Gender
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          Location
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">
                          Blood Group
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={profile.photoUrl || undefined}
                                  alt={profile.name}
                                />
                                <AvatarFallback>
                                  {getInitials(profile.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {profile.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {profile.bnName}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ID: {profile.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {profile.userType.displayName}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {profile.userType.banglaName}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="space-y-1">
                              {profile.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span>{profile.phone}</span>
                                </div>
                              )}
                              {profile.email && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="truncate max-w-[200px]">
                                    {profile.email}
                                  </span>
                                </div>
                              )}
                              {!profile.phone && !profile.email && (
                                <span className="text-gray-400 text-sm">
                                  No contact
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {profile.gender ? (
                              <div>
                                <div className="text-sm">
                                  {profile.gender.displayName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {profile.gender.banglaName}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {profile.district ? (
                              <div className="flex items-start gap-1">
                                <MapPin className="h-3 w-3 text-gray-400 mt-1" />
                                <div>
                                  <div className="text-sm">
                                    {profile.district.name}
                                  </div>
                                  {profile.upazila && (
                                    <div className="text-xs text-gray-500">
                                      {profile.upazila.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {profile.bloodGroup ? (
                              <div>
                                <Badge
                                  variant={
                                    profile.isBloodDonor
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {profile.bloodGroup.displayName}
                                </Badge>
                                {profile.isBloodDonor && (
                                  <div className="flex items-center justify-center gap-1 mt-1">
                                    <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                                    <span className="text-xs text-gray-600">
                                      Donor
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <Badge
                              variant={
                                profile.isActive ? "default" : "secondary"
                              }
                            >
                              {profile.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {profile.isVolunteer && "Volunteer"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || filterByUserType
                  ? "No profiles found matching your criteria"
                  : "No profiles available"}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ProfileManagement;
