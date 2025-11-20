"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Droplet,
  Activity,
  Globe,
  Facebook,
  Linkedin,
  Monitor,
  Clock,
  Eye,
  MousePointerClick,
  Share2,
  Twitter,
  Instagram,
  Youtube,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfileById, ProfileDetailsResponse } from "@/api/profile";
import { getUserSession } from "@/lib/auth-client";

export default function ProfileDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = parseInt(params.id as string);

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<ProfileDetailsResponse>({
    queryKey: ["profile", profileId],
    queryFn: () => {
      const session = getUserSession();
      const token = session?.access_token;
      return getProfileById(profileId, true, true, token);
    },
    enabled: !!profileId,
  });

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP p");
    } catch {
      return "Invalid date";
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Profile Details"
          description="View profile information"
        >
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </AdminHeader>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Error loading profile:{" "}
                {(error as Error)?.message || "Unknown error"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Profile Details"
        description="View complete profile information"
      >
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </AdminHeader>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : profile ? (
          <>
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={profile.photoUrl || undefined}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-4xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">{profile.name}</h2>
                        <Badge
                          variant={profile.isActive ? "default" : "secondary"}
                        >
                          {profile.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {profile.isVolunteer && (
                          <Badge variant="outline">Volunteer</Badge>
                        )}
                      </div>
                      <p className="text-xl text-muted-foreground">
                        {profile.bnName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ID: {profile.id}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {profile.userType.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {profile.userType.banglaName}
                          </p>
                        </div>
                      </div>

                      {profile.gender && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {profile.gender.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.gender.banglaName}
                            </p>
                          </div>
                        </div>
                      )}

                      {profile.dateOfBirth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Date of Birth</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(profile.dateOfBirth)}
                            </p>
                          </div>
                        </div>
                      )}

                      {profile.bloodGroup && (
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">
                              {profile.bloodGroup.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.isBloodDonor
                                ? "Blood Donor"
                                : "Not a donor"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.username && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.username}
                        </p>
                      </div>
                    </div>
                  )}
                  {!profile.phone && !profile.email && !profile.username && (
                    <p className="text-sm text-muted-foreground">
                      No contact information available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.district && (
                    <div>
                      <p className="text-sm font-medium">District</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.district.name} ({profile.district.bnName})
                      </p>
                    </div>
                  )}
                  {profile.upazila && (
                    <div>
                      <p className="text-sm font-medium">Upazila</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.upazila.name} ({profile.upazila.bnName})
                      </p>
                    </div>
                  )}
                  {profile.union && (
                    <div>
                      <p className="text-sm font-medium">Union</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.union.name} ({profile.union.bnName})
                      </p>
                    </div>
                  )}
                  {profile.address && (
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.address}
                      </p>
                    </div>
                  )}
                  {!profile.district &&
                    !profile.upazila &&
                    !profile.union &&
                    !profile.address && (
                      <p className="text-sm text-muted-foreground">
                        No location information available
                      </p>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            {(profile.facebookProfileUrl?.trim() ||
              profile.linkedinProfileUrl?.trim() ||
              profile.researchGateProfileUrl?.trim() ||
              profile.xprofileUrl?.trim()) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {profile.facebookProfileUrl?.trim() && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.facebookProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {profile.linkedinProfileUrl?.trim() && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.linkedinProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile.researchGateProfileUrl?.trim() && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.researchGateProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Activity className="mr-2 h-4 w-4" />
                          ResearchGate
                        </a>
                      </Button>
                    )}
                    {profile.xprofileUrl?.trim() && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.xprofileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="mr-2 h-4 w-4" />X (Twitter)
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Activity */}
            {profile.userActivity && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(profile.userActivity.lastLoginTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Activity</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(
                            profile.userActivity.lastActivityTime
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Device</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.userActivity.lastLoginDevice || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Browser</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.userActivity.lastLoginBrowser || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Logins</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.userActivity.totalLogins}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Sessions</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.userActivity.totalSessions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Ad Views</p>
                        <p className="text-sm text-muted-foreground">
                          Last seen:{" "}
                          {formatDateTime(profile.userActivity.lastAdSeen)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Ad Clicks</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.userActivity.adClickCount} clicks
                        </p>
                      </div>
                    </div>

                    {profile.userActivity.lastLoginIp && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">IP Address</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {profile.userActivity.lastLoginIp}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blood Donor Status */}
            {profile.isBloodDonor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    Blood Donor Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Blood Group</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.bloodGroup?.displayName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Donations</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.bloodDonationCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Donation</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(profile.lastBloodDonationDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Links */}
            {(profile.facebookProfileUrl ||
              profile.facebookPageUrl ||
              profile.linkedinProfileUrl ||
              profile.researchGateProfileUrl ||
              profile.xprofileUrl ||
              profile.instagramProfileUrl ||
              profile.youtubeChannelUrl ||
              profile.websiteUrl ||
              profile.blogUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Social Media & Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {profile.facebookProfileUrl && (
                      <a
                        href={profile.facebookProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Facebook Profile
                        </span>
                      </a>
                    )}
                    {profile.facebookPageUrl && (
                      <a
                        href={profile.facebookPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Facebook Page
                        </span>
                      </a>
                    )}
                    {profile.linkedinProfileUrl && (
                      <a
                        href={profile.linkedinProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-blue-700" />
                        <span className="text-sm font-medium text-blue-900">
                          LinkedIn
                        </span>
                      </a>
                    )}
                    {profile.xprofileUrl && (
                      <a
                        href={profile.xprofileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <Twitter className="h-5 w-5 text-slate-700" />
                        <span className="text-sm font-medium text-slate-900">
                          X (Twitter)
                        </span>
                      </a>
                    )}
                    {profile.instagramProfileUrl && (
                      <a
                        href={profile.instagramProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 transition-colors"
                      >
                        <Instagram className="h-5 w-5 text-pink-600" />
                        <span className="text-sm font-medium text-pink-900">
                          Instagram
                        </span>
                      </a>
                    )}
                    {profile.youtubeChannelUrl && (
                      <a
                        href={profile.youtubeChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Youtube className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-900">
                          YouTube
                        </span>
                      </a>
                    )}
                    {profile.researchGateProfileUrl && (
                      <a
                        href={profile.researchGateProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-colors"
                      >
                        <Globe className="h-5 w-5 text-teal-600" />
                        <span className="text-sm font-medium text-teal-900">
                          ResearchGate
                        </span>
                      </a>
                    )}
                    {profile.websiteUrl && (
                      <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors"
                      >
                        <Monitor className="h-5 w-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-900">
                          Website
                        </span>
                      </a>
                    )}
                    {profile.blogUrl && (
                      <a
                        href={profile.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">
                          Blog
                        </span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Health Data Consent</p>
                    <Badge
                      variant={
                        profile.healthDataConsent ? "default" : "secondary"
                      }
                    >
                      {profile.healthDataConsent ? "Granted" : "Not Granted"}
                    </Badge>
                  </div>
                  {profile.keycloakUserId && (
                    <div>
                      <p className="text-sm font-medium">Keycloak User ID</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {profile.keycloakUserId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Blood Donation History - Moved to end */}
            {profile.bloodDonationList &&
              profile.bloodDonationList.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Blood Donation History ({
                        profile.bloodDonationList.length
                      }{" "}
                      donations)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.bloodDonationList.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between py-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500 flex-shrink-0" />
                            <div className="flex items-center gap-2 flex-wrap flex-1">
                              <span className="font-medium">
                                {donation.hospital.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({donation.hospital.bnName})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              {donation.bloodComponent.banglaName}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {donation.hospital.district.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(donation.donationDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplet className="h-3 w-3" />
                              {donation.quantityMl} ml
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        ) : null}
      </div>
    </div>
  );
}
