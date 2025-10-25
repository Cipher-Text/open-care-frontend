"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Bed,
  Badge as BadgeIcon,
  Stethoscope,
  FlaskConical,
  Sparkles,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { fetchHospitalDetailsById } from "@/api/hospitals";
import { HospitalDetailsResponse } from "@/types/hospitals";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HospitalViewPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = parseInt(params.id as string);

  const {
    data: hospital,
    isLoading,
    isError,
    error,
  } = useQuery<HospitalDetailsResponse>({
    queryKey: ["hospital-details", hospitalId],
    queryFn: () => fetchHospitalDetailsById(hospitalId),
    enabled: !!hospitalId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Hospital Details"
          description="Loading hospital information..."
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
          title="Hospital Details"
          description="Error loading hospital"
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
              : "Failed to load hospital details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader title="Hospital Details" description="Hospital not found">
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
            Hospital not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={hospital.name}
        description={`${hospital.bnName} - Hospital Details`}
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
        {/* Hospital Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hospital Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm font-semibold">{hospital.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Bengali Name
                </label>
                <p className="text-sm">{hospital.bnName}</p>
              </div>
            </div>

            {/* Type and Organization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Hospital Type
                </label>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  {hospital.hospitalType?.englishName ||
                    hospital.hospitalType?.banglaName ||
                    "N/A"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Organization Type
                </label>
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1"
                >
                  <BadgeIcon className="h-3 w-3" />
                  {hospital.organizationType?.displayName ||
                    hospital.organizationType?.banglaName ||
                    "N/A"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Number of Beds
                </label>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold">
                    {hospital.numberOfBed?.toLocaleString() || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {hospital.websiteUrl && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Contact Information
                </h4>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a
                    href={hospital.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {hospital.websiteUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hospital.district && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      District
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {hospital.district.name || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {hospital.upazila && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Upazila
                    </label>
                    <p className="text-sm">{hospital.upazila.name || "N/A"}</p>
                  </div>
                )}
                {hospital.union && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Union
                    </label>
                    <p className="text-sm">{hospital.union.name || "N/A"}</p>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              {(hospital.lat || hospital.lon) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {hospital.lat && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Latitude
                      </label>
                      <p className="text-sm font-mono">{hospital.lat}</p>
                    </div>
                  )}
                  {hospital.lon && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Longitude
                      </label>
                      <p className="text-sm font-mono">{hospital.lon}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Division Info from District */}
              {hospital.district?.division && (
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-gray-500">
                    Division
                  </label>
                  <p className="text-sm">
                    {hospital.district.division.name || "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {hospital.tags && hospital.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.displayName || tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Doctors ({hospital.doctors?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.doctors && hospital.doctors.length > 0 ? (
              <div className="space-y-4">
                {hospital.doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {doctor.profile.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {doctor.profile.bnName}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="secondary" className="font-mono">
                          {doctor.bmdcNo}
                        </Badge>
                        {doctor.isVerified && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {doctor.specializations && (
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {doctor.specializations}
                        </span>
                      </div>
                    )}

                    {doctor.yearOfExperience && (
                      <div className="flex items-center gap-2">
                        <BadgeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {doctor.yearOfExperience} years of experience
                        </span>
                      </div>
                    )}

                    {(doctor.profile.email || doctor.profile.phone) && (
                      <div className="flex flex-wrap gap-4 pt-2 border-t">
                        {doctor.profile.email && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {doctor.profile.email}
                            </span>
                          </div>
                        )}
                        {doctor.profile.phone && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {doctor.profile.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No doctors found.</p>
            )}
          </CardContent>
        </Card>

        {/* Medical Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Medical Tests ({hospital.tests?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.tests && hospital.tests.length > 0 ? (
              <div className="space-y-4">
                {hospital.tests.map((test) => (
                  <div
                    key={test.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="text-base font-semibold">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.medicalTest.bnName}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <DollarSign className="h-3 w-3" />৳
                          {test.price.toLocaleString()}
                        </Badge>
                        {test.isActive ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>

                    {test.category && (
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Category: {test.category}
                        </span>
                      </div>
                    )}

                    {test.testCode && (
                      <div className="flex items-center gap-2">
                        <BadgeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-mono">
                          Code: {test.testCode}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {test.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>

                    {test.description && (
                      <p className="text-sm text-gray-600 pt-2 border-t">
                        {test.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No medical tests found.</p>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Amenities & Services ({hospital.amenities?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.amenities && hospital.amenities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {amenity.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {amenity.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      {amenity.isActive ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>

                    {amenity.price > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-semibold">
                          ৳{amenity.price.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">
                          Total: {amenity.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-gray-600">
                          Available: {amenity.available}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No amenities or services found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
