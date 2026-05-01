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
} from "lucide-react";
import { fetchAssociationById } from "@/api/associations";
import { Association } from "@/types/associations";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AssociationViewPage() {
  const params = useParams();
  const router = useRouter();
  const associationId = parseInt(params.id as string);

  const {
    data: association,
    isLoading,
    isError,
    error,
  } = useQuery<Association>({
    queryKey: ["association", associationId],
    queryFn: () => fetchAssociationById(associationId),
    enabled: !!associationId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Association Details"
          description="Loading association information..."
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

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
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
          title="Association Details"
          description="Error loading association"
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
              : "Failed to load association details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Association Details"
          description="Association not found"
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
            Association not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={association.name}
        description={`${association.shortName} - Association Details`}
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
        {/* Association Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Association Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm font-semibold">{association.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Bengali Name
                </label>
                <p className="text-sm">{association.bnName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Short Name
                </label>
                <p className="text-sm">{association.shortName}</p>
              </div>
            </div>

            {/* Type and Domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Association Type
                </label>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <BadgeIcon className="h-3 w-3" />
                  {association.associationType?.displayName ||
                    association.associationType?.bnName ||
                    "N/A"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Domain
                </label>
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  {association.domain?.displayName ||
                    association.domain?.banglaName ||
                    "N/A"}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {association.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{association.email}</span>
                  </div>
                )}
                {association.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{association.phone}</span>
                  </div>
                )}
                {association.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={association.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {association.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {association.originCountry?.displayNameEn ||
                        association.originCountry?.nameBn ||
                        "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Division
                  </label>
                  <p className="text-sm">
                    {association.division?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    District
                  </label>
                  <p className="text-sm">
                    {association.district?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {(association.facebookUrl ||
              association.twitterUrl ||
              association.linkedinUrl ||
              association.youtubeUrl) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Social Media
                </h4>
                <div className="flex flex-wrap gap-2">
                  {association.facebookUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={association.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                  )}
                  {association.twitterUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={association.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                  )}
                  {association.linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={association.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {association.youtubeUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={association.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {(association.foundedDate || association.description) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {association.foundedDate && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Founded Date
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(
                            association.foundedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {association.description && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="text-sm text-gray-700">
                        {association.description}
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
