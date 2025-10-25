"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Building2,
  Award,
  Stethoscope,
} from "lucide-react";
import { fetchDoctorDetailsById } from "@/api/doctors";
import { DoctorDetailsResponse } from "@/types/doctors";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DoctorViewPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = parseInt(params.id as string);

  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useQuery<DoctorDetailsResponse>({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => fetchDoctorDetailsById(doctorId),
    enabled: !!doctorId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader
          title="Doctor Details"
          description="Loading doctor information..."
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
        <AdminHeader title="Doctor Details" description="Error loading doctor">
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
              : "Failed to load doctor details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader title="Doctor Details" description="Doctor not found">
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
            Doctor not found or may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title={doctor.profile.name}
        description={`${doctor.bmdcNo} - Doctor Profile`}
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
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm font-semibold">{doctor.profile.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Bengali Name
                </label>
                <p className="text-sm">{doctor.profile.bnName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  BMDC No.
                </label>
                <p className="text-sm font-mono">{doctor.bmdcNo}</p>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Specializations
                </label>
                <p className="text-sm">{doctor.specializations || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Years of Experience
                </label>
                <p className="text-sm">
                  {doctor.yearOfExperience
                    ? `${doctor.yearOfExperience} years`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={doctor.isActive ? "default" : "secondary"}
                  className="flex w-fit items-center gap-1"
                >
                  <Activity className="h-3 w-3" />
                  {doctor.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  variant={doctor.isVerified ? "default" : "destructive"}
                  className="flex w-fit items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  {doctor.isVerified ? "Verified" : "Unverified"}
                </Badge>
                {doctor.profile.userType && (
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {doctor.profile.userType.banglaName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{doctor.profile.email}</span>
                  </div>
                )}
                {doctor.profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{doctor.profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            {(doctor.profile.district ||
              doctor.profile.upazila ||
              doctor.profile.address) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doctor.profile.district && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        District
                      </label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {doctor.profile.district.name}
                        </span>
                      </div>
                    </div>
                  )}
                  {doctor.profile.upazila && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Upazila
                      </label>
                      <p className="text-sm">{doctor.profile.upazila.name}</p>
                    </div>
                  )}
                  {doctor.profile.address && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Address
                      </label>
                      <p className="text-sm">{doctor.profile.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {doctor.profile.gender && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-sm">
                      {doctor.profile.gender.banglaName ||
                        doctor.profile.gender.displayName ||
                        "N/A"}
                    </p>
                  </div>
                )}
                {doctor.profile.dateOfBirth && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(
                          doctor.profile.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                {doctor.profile.bloodGroup && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Blood Group
                    </label>
                    <p className="text-sm">{doctor.profile.bloodGroup}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            {(doctor.profile.facebookProfileUrl ||
              doctor.profile.linkedinProfileUrl ||
              doctor.profile.researchGateProfileUrl ||
              doctor.profile.xprofileUrl) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Social Media
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.profile.facebookProfileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={doctor.profile.facebookProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                  )}
                  {doctor.profile.linkedinProfileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={doctor.profile.linkedinProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {doctor.profile.researchGateProfileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={doctor.profile.researchGateProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ResearchGate
                      </a>
                    </Button>
                  )}
                  {doctor.profile.xprofileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={doctor.profile.xprofileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        X (Twitter)
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {doctor.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-sm text-gray-700">{doctor.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Degrees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educational Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.doctorDegrees && doctor.doctorDegrees.length > 0 ? (
              <div className="space-y-4">
                {doctor.doctorDegrees.map((degreeInfo) => (
                  <div
                    key={degreeInfo.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {degreeInfo.degree.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {degreeInfo.degree.abbreviation}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {degreeInfo.degree.degreeType?.banglaName ||
                          degreeInfo.degree.degreeType?.displayName ||
                          "N/A"}
                      </Badge>
                    </div>

                    {degreeInfo.institution && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {degreeInfo.institution.name}
                          </span>
                        </div>
                        {degreeInfo.institution.district && (
                          <div className="flex items-center gap-2 ml-6">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {degreeInfo.institution.district.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {degreeInfo.medicalSpeciality && (
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {degreeInfo.medicalSpeciality.name}
                        </span>
                      </div>
                    )}

                    {(degreeInfo.startDate || degreeInfo.endDate) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {degreeInfo.startDate
                            ? new Date(degreeInfo.startDate).getFullYear()
                            : "N/A"}
                          {" - "}
                          {degreeInfo.endDate
                            ? new Date(degreeInfo.endDate).getFullYear()
                            : "Present"}
                        </span>
                      </div>
                    )}

                    {degreeInfo.grade && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Grade: {degreeInfo.grade}
                        </span>
                      </div>
                    )}

                    {degreeInfo.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {degreeInfo.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No educational qualifications found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Workplaces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Workplaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.doctorWorkplaces && doctor.doctorWorkplaces.length > 0 ? (
              <div className="space-y-4">
                {doctor.doctorWorkplaces.map((workplace) => (
                  <div
                    key={workplace.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {workplace.hospital?.name ||
                            workplace.institution?.name ||
                            "N/A"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {workplace.hospital?.bnName ||
                            workplace.institution?.bnName ||
                            ""}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {workplace.doctorPosition ||
                          workplace.teacherPosition ||
                          "N/A"}
                      </Badge>
                    </div>

                    {workplace.medicalSpeciality && (
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {workplace.medicalSpeciality.name}
                        </span>
                      </div>
                    )}

                    {workplace.hospital && (
                      <div className="space-y-2">
                        {workplace.hospital.district && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {workplace.hospital.district.name}
                            </span>
                          </div>
                        )}
                        {workplace.hospital.hospitalType && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {typeof workplace.hospital.hospitalType ===
                              "string"
                                ? workplace.hospital.hospitalType
                                : workplace.hospital.hospitalType.banglaName ||
                                  workplace.hospital.hospitalType.englishName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {(workplace.startDate || workplace.endDate) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {workplace.startDate
                            ? new Date(workplace.startDate).toLocaleDateString()
                            : "N/A"}
                          {" - "}
                          {workplace.endDate
                            ? new Date(workplace.endDate).toLocaleDateString()
                            : "Present"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No workplace information found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Associations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Professional Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.doctorAssociations &&
            doctor.doctorAssociations.length > 0 ? (
              <div className="space-y-4">
                {doctor.doctorAssociations.map((assocInfo) => (
                  <div
                    key={assocInfo.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold">
                          {assocInfo.association.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {assocInfo.association.bnName}
                        </p>
                        {assocInfo.association.shortName && (
                          <p className="text-sm text-gray-500">
                            ({assocInfo.association.shortName})
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="secondary">
                          {assocInfo.membershipType?.displayName || "Member"}
                        </Badge>
                        {assocInfo.isActive && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                    </div>

                    {assocInfo.association.associationType && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {assocInfo.association.associationType.bnName ||
                            assocInfo.association.associationType.displayName}
                        </span>
                      </div>
                    )}

                    {assocInfo.association.district && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {assocInfo.association.district.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Member since:{" "}
                        {new Date(assocInfo.startDate).toLocaleDateString()}
                        {assocInfo.endDate &&
                          ` - ${new Date(
                            assocInfo.endDate
                          ).toLocaleDateString()}`}
                      </span>
                    </div>

                    {(assocInfo.association.email ||
                      assocInfo.association.phone ||
                      assocInfo.association.websiteUrl) && (
                      <div className="space-y-2 pt-2 border-t">
                        {assocInfo.association.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {assocInfo.association.email}
                            </span>
                          </div>
                        )}
                        {assocInfo.association.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {assocInfo.association.phone}
                            </span>
                          </div>
                        )}
                        {assocInfo.association.websiteUrl && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <a
                              href={assocInfo.association.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {assocInfo.association.websiteUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No professional associations found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
