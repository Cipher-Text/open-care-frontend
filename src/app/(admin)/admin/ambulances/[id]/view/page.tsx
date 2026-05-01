"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Truck,
  Phone,
  User,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Badge as BadgeIcon,
  Link as LinkIcon,
} from "lucide-react";
import { fetchAmbulanceById } from "@/api/ambulances";
import { Ambulance } from "@/types/ambulances";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AmbulanceViewPage() {
  const params = useParams();
  const router = useRouter();
  const ambulanceId = parseInt(params.id as string);

  const {
    data: ambulance,
    isLoading,
    isError,
    error,
  } = useQuery<Ambulance>({
    queryKey: ["ambulance", ambulanceId],
    queryFn: () => fetchAmbulanceById(ambulanceId),
    enabled: !!ambulanceId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Ambulance Details"
          description="Loading ambulance information..."
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </AdminHeader>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Ambulance Details"
          description="Error loading ambulance"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </AdminHeader>

        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load ambulance details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!ambulance) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Ambulance Details"
          description="Ambulance not found"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </AdminHeader>

        <Alert>
          <AlertDescription>
            Ambulance not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={`Ambulance ${ambulance.vehicleNumber}`}
        description="Ambulance Details"
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </AdminHeader>

      <div className="grid gap-6">
        {/* Ambulance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Ambulance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Vehicle Number
                </label>
                <p className="text-sm font-semibold font-mono">
                  {ambulance.vehicleNumber}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Type
                </label>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <BadgeIcon className="h-3 w-3" />
                  {ambulance.type?.description ||
                    ambulance.type?.value ||
                    "N/A"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  {ambulance.isActive ? (
                    <Badge
                      variant="default"
                      className="flex w-fit items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex w-fit items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Availability and Affiliation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Availability
                </label>
                {ambulance.isAvailable ? (
                  <Badge
                    variant="default"
                    className="flex w-fit items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Available
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="flex w-fit items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Not Available
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Affiliation
                </label>
                {ambulance.isAffiliated ? (
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Affiliated
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex w-fit items-center gap-1"
                  >
                    Independent
                  </Badge>
                )}
              </div>
            </div>

            {/* Driver Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Driver Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Driver Name
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{ambulance.driverName}</span>
                  </div>
                </div>
                {ambulance.driverPhone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Driver Phone
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a
                        href={`tel:${ambulance.driverPhone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {ambulance.driverPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ambulance.district && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      District
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {ambulance.district.name || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {ambulance.upazila && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Upazila
                    </label>
                    <p className="text-sm">{ambulance.upazila.name || "N/A"}</p>
                  </div>
                )}
              </div>

              {/* Division Info from District */}
              {ambulance.district?.division && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Division
                  </label>
                  <p className="text-sm">
                    {ambulance.district.division.name || "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Affiliated Hospital */}
            {ambulance.hospital && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Affiliated Hospital
                </h4>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Hospital Name
                        </label>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-semibold">
                              {ambulance.hospital.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {ambulance.hospital.bnName}
                            </p>
                          </div>
                        </div>
                      </div>
                      {ambulance.hospital.numberOfBed && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Number of Beds
                          </label>
                          <p className="text-sm">
                            {ambulance.hospital.numberOfBed.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {ambulance.hospital.district && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Hospital Location
                          </label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {ambulance.hospital.district.name}
                            </span>
                          </div>
                        </div>
                      )}
                      {ambulance.hospital.hospitalType && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Hospital Type
                          </label>
                          <Badge variant="outline">
                            {ambulance.hospital.hospitalType.englishName ||
                              ambulance.hospital.hospitalType.banglaName ||
                              "N/A"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Metadata */}
            {(ambulance.createdAt || ambulance.updatedAt) && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700">
                  Record Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                  {ambulance.createdAt && (
                    <div className="space-y-1">
                      <label className="font-medium">Created</label>
                      <p>
                        {new Date(ambulance.createdAt).toLocaleString()}
                        {ambulance.createdBy && ` by ${ambulance.createdBy}`}
                      </p>
                    </div>
                  )}
                  {ambulance.updatedAt && (
                    <div className="space-y-1">
                      <label className="font-medium">Last Updated</label>
                      <p>
                        {new Date(ambulance.updatedAt).toLocaleString()}
                        {ambulance.updatedBy && ` by ${ambulance.updatedBy}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
