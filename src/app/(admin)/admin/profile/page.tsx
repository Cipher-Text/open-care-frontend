"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { getUserSession } from "@/lib/auth-client";
import { getSelfProfile } from "@/api/profile";
import { UserProfile } from "@/types/profile";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplets,
  Heart,
  Shield,
  ExternalLink,
  Edit,
  Camera,
} from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = getUserSession();
        if (!session?.access_token) {
          throw new Error("No access token found");
        }

        const profileData = await getSelfProfile(session.access_token);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Profile"
          description="Manage your personal profile and account settings"
        />
        <div className="flex items-center justify-center min-h-96 p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Profile"
          description="Manage your personal profile and account settings"
        />
        <div className="flex items-center justify-center min-h-96 p-8">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p>Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Profile"
          description="Manage your personal profile and account settings"
        />
        <div className="flex items-center justify-center min-h-96 p-8">
          <p>No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Profile"
        description="Manage your personal profile and account settings"
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.photoUrl || ""}
                    alt={profile.name}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <Badge variant="secondary" className="w-fit">
                    {profile.userType.displayName}
                  </Badge>
                </div>
                <p className="text-muted-foreground">@{profile.username}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                </div>
              </div>

              <Button className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="mt-1">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bangla Name
                </label>
                <p className="mt-1">{profile.bnName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p className="mt-1">{profile.gender?.displayName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="mt-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(profile.dateOfBirth || "")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Group
                </label>
                <p className="mt-1 flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-red-500" />
                  {profile.bloodGroup?.displayName || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant={profile.isActive ? "default" : "secondary"}>
                    {profile.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {profile.address && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="mt-1 flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {profile.address}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        {(profile.district || profile.upazila || profile.union) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.district && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      District
                    </label>
                    <p className="mt-1">{profile.district.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.district.bnName}
                    </p>
                  </div>
                )}
                {profile.upazila && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Upazila
                    </label>
                    <p className="mt-1">{profile.upazila.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.upazila.bnName}
                    </p>
                  </div>
                )}
                {profile.union && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Union
                    </label>
                    <p className="mt-1">{profile.union.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.union.bnName}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blood Donation & Volunteer Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Blood Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blood Donor</span>
                <Badge variant={profile.isBloodDonor ? "default" : "secondary"}>
                  {profile.isBloodDonor ? "Yes" : "No"}
                </Badge>
              </div>
              {profile.isBloodDonor && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Donation Count</span>
                    <span className="font-semibold">
                      {profile.bloodDonationCount}
                    </span>
                  </div>
                  {profile.lastBloodDonationDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Donation</span>
                      <span className="text-sm">
                        {formatDate(profile.lastBloodDonationDate)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Other Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Volunteer</span>
                <Badge variant={profile.isVolunteer ? "default" : "secondary"}>
                  {profile.isVolunteer ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Health Data Consent</span>
                <Badge
                  variant={profile.healthDataConsent ? "default" : "secondary"}
                >
                  {profile.healthDataConsent ? "Given" : "Not Given"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Links */}
        {(profile.facebookProfileUrl?.trim() ||
          profile.linkedinProfileUrl?.trim() ||
          profile.researchGateProfileUrl?.trim() ||
          profile.xprofileUrl?.trim()) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.facebookProfileUrl?.trim() && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Facebook
                    </label>
                    <p className="mt-1">
                      <a
                        href={profile.facebookProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
                {profile.linkedinProfileUrl?.trim() && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      LinkedIn
                    </label>
                    <p className="mt-1">
                      <a
                        href={profile.linkedinProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
                {profile.researchGateProfileUrl?.trim() && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ResearchGate
                    </label>
                    <p className="mt-1">
                      <a
                        href={profile.researchGateProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
                {profile.xprofileUrl?.trim() && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      X (Twitter)
                    </label>
                    <p className="mt-1">
                      <a
                        href={profile.xprofileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
