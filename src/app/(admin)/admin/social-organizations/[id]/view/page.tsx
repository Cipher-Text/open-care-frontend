"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Badge as BadgeIcon,
  Heart,
} from "lucide-react";
import { fetchSocialOrganizationById } from "@/api/social-organizations";
import { SocialOrganization } from "@/types/social-organizations";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SocialOrganizationViewPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useQuery<SocialOrganization>({
    queryKey: ["social-organization", organizationId],
    queryFn: () => fetchSocialOrganizationById(organizationId),
    enabled: !!organizationId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Social Organization Details"
          description="Loading social organization information..."
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
          title="Social Organization Details"
          description="Error loading social organization"
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
              : "Failed to load social organization details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Social Organization Details"
          description="Social organization not found"
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
            Social organization not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={organization.name}
        description={`${organization.bnName} - Social Organization Details`}
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
        {/* Social Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Social Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm font-semibold">{organization.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Bengali Name
                </label>
                <p className="text-sm">{organization.bnName}</p>
              </div>
            </div>

            {/* Type and Origin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Organization Type
                </label>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <BadgeIcon className="h-3 w-3" />
                  {organization.socialOrganizationType?.displayName ||
                    organization.socialOrganizationType?.banglaName ||
                    "N/A"}
                </Badge>
              </div>
              {organization.originCountry && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Origin Country
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {organization.originCountry.displayNameEn ||
                        organization.originCountry.nameBn ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Founded Date */}
            {organization.foundedDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Founded Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(organization.foundedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            {organization.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-sm text-gray-700">
                  {organization.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{organization.email}</span>
                  </div>
                )}
                {organization.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{organization.phone}</span>
                  </div>
                )}
                {organization.websiteUrl && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={organization.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {organization.websiteUrl}
                    </a>
                  </div>
                )}
                {organization.address && (
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{organization.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            {(organization.facebookUrl ||
              organization.twitterUrl ||
              organization.linkedinUrl ||
              organization.youtubeUrl) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Social Media
                </h4>
                <div className="flex flex-wrap gap-2">
                  {organization.facebookUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={organization.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                  )}
                  {organization.twitterUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={organization.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                  )}
                  {organization.linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={organization.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {organization.youtubeUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={organization.youtubeUrl}
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

            {/* Tags */}
            {organization.tags && organization.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {organization.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
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
