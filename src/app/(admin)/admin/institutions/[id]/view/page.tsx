"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  Badge as BadgeIcon,
  GraduationCap,
} from "lucide-react";
import { fetchInstitutionById } from "@/api/institutions";
import { Institution } from "@/types/institutions";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InstitutionViewPage() {
  const params = useParams();
  const router = useRouter();
  const institutionId = params.id as string;

  const {
    data: institution,
    isLoading,
    isError,
    error,
  } = useQuery<Institution>({
    queryKey: ["institution", institutionId],
    queryFn: () => fetchInstitutionById(institutionId),
    enabled: !!institutionId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Institution Details"
          description="Loading institution information..."
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
          title="Institution Details"
          description="Error loading institution"
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
              : "Failed to load institution details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Institution Details"
          description="Institution not found"
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
            Institution not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={institution.name}
        description={`${
          institution.acronym || institution.bnName
        } - Institution Details`}
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
        {/* Institution Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Institution Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm font-semibold">{institution.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Bengali Name
                </label>
                <p className="text-sm">{institution.bnName}</p>
              </div>
              {institution.acronym && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Acronym
                  </label>
                  <p className="text-sm">{institution.acronym}</p>
                </div>
              )}
            </div>

            {/* Type and Organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Institution Type
                </label>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <GraduationCap className="h-3 w-3" />
                  {institution.institutionType?.englishName ||
                    institution.institutionType?.banglaName ||
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
                  {institution.organizationType?.displayName ||
                    institution.organizationType?.banglaName ||
                    "N/A"}
                </Badge>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Academic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {institution.establishedYear && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Established Year
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {institution.establishedYear}
                      </span>
                    </div>
                  </div>
                )}
                {institution.enroll !== undefined &&
                  institution.enroll !== null && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Enrollment
                      </label>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {institution.enroll} students
                        </span>
                      </div>
                    </div>
                  )}
                {institution.affiliated !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Affiliation Status
                    </label>
                    <Badge
                      variant={institution.affiliated ? "default" : "secondary"}
                    >
                      {institution.affiliated ? "Affiliated" : "Not Affiliated"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {institution.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{institution.email}</span>
                  </div>
                )}
                {institution.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{institution.phone}</span>
                  </div>
                )}
                {institution.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={institution.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {institution.websiteUrl}
                    </a>
                  </div>
                )}
                {institution.address && (
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{institution.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {institution.country && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Country
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {institution.country.displayNameEn ||
                          institution.country.nameBn ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {institution.district && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      District
                    </label>
                    <p className="text-sm">
                      {institution.district.name || "N/A"}
                    </p>
                  </div>
                )}
                {institution.upazila && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Upazila
                    </label>
                    <p className="text-sm">
                      {institution.upazila.name || "N/A"}
                    </p>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              {(institution.lat || institution.lon) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {institution.lat && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Latitude
                      </label>
                      <p className="text-sm font-mono">{institution.lat}</p>
                    </div>
                  )}
                  {institution.lon && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Longitude
                      </label>
                      <p className="text-sm font-mono">{institution.lon}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Affiliated Hospital */}
            {institution.affiliatedHospital && (
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
                        <p className="text-sm font-semibold">
                          {institution.affiliatedHospital.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {institution.affiliatedHospital.bnName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Number of Beds
                        </label>
                        <p className="text-sm">
                          {institution.affiliatedHospital.numberOfBed || "N/A"}
                        </p>
                      </div>
                      {institution.affiliatedHospital.district && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Location
                          </label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {institution.affiliatedHospital.district.name}
                            </span>
                          </div>
                        </div>
                      )}
                      {institution.affiliatedHospital.websiteUrl && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Website
                          </label>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <a
                              href={institution.affiliatedHospital.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tags */}
            {institution.tags && institution.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {institution.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.displayName || tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
