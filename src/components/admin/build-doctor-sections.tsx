"use client";

import {
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
	Stethoscope,
} from "lucide-react";
import { DoctorDetailsResponse } from "@/types/doctors";
import { DetailSection } from "./detail-view";
import {
	buildDetailSections,
	SectionConfig,
	PropertyConfig,
} from "./build-detail-sections";

export function buildDoctorDetailSections(
	doctor: DoctorDetailsResponse
): DetailSection[] {
	const formatBloodGroup = (
		bloodGroup:
			| DoctorDetailsResponse["profile"]["bloodGroup"]
			| { value?: string; displayName?: string; bnName?: string }
	) => {
		if (!bloodGroup) {
			return "N/A";
		}

		if (typeof bloodGroup === "string") {
			return bloodGroup;
		}

		return bloodGroup.displayName || bloodGroup.bnName || bloodGroup.value;
	};

	const profileProperties: PropertyConfig[] = [
		{ label: "Name", value: doctor.profile.name || "N/A" },
		{ label: "Bengali Name", value: doctor.profile.bnName || "N/A" },
		{
			label: "BMDC No.",
			value: doctor.bmdcNo || "N/A",
			icon: <Shield className="h-4 w-4" />,
		},
		{ label: "Specializations", value: doctor.specializations || "N/A" },
		{
			label: "Years of Experience",
			value: doctor.yearOfExperience
				? `${doctor.yearOfExperience} years`
				: "N/A",
		},
		{
			label: "Status",
			value: doctor.isActive ? "Active" : "Inactive",
			icon: <Activity className="h-4 w-4" />,
		},
		{
			label: "Verification",
			value: doctor.isVerified ? "Verified" : "Unverified",
			icon: <Shield className="h-4 w-4" />,
		},
		{
			label: "Email",
			value: doctor.profile.email || "N/A",
			icon: <Mail className="h-4 w-4" />,
		},
		{
			label: "Phone",
			value: doctor.profile.phone || "N/A",
			icon: <Phone className="h-4 w-4" />,
		},
		{
			label: "District",
			value: doctor.profile.district?.name || "N/A",
			icon: <MapPin className="h-4 w-4" />,
		},
		{ label: "Upazila", value: doctor.profile.upazila?.name || "N/A" },
		{ label: "Address", value: doctor.profile.address || "N/A" },
		{
			label: "Gender",
			value:
				doctor.profile.gender?.banglaName ||
				doctor.profile.gender?.displayName ||
				"N/A",
		},
		{
			label: "Date of Birth",
			value: doctor.profile.dateOfBirth
				? new Date(doctor.profile.dateOfBirth).toLocaleDateString()
				: "N/A",
			icon: <Calendar className="h-4 w-4" />,
		},
		{ label: "Blood Group", value: formatBloodGroup(doctor.profile.bloodGroup) },
		{ label: "Description", value: doctor.description || "N/A" },
	];

	const degreesProperties: PropertyConfig[] =
		doctor.doctorDegrees?.map((degreeInfo) => ({
			label: `${degreeInfo.degree.name} (${degreeInfo.degree.abbreviation})`,
			value: (
				<div className="space-y-2">
					<div>
						{degreeInfo.degree.degreeType?.banglaName ||
							degreeInfo.degree.degreeType?.displayName ||
							"N/A"}
					</div>
					{degreeInfo.institution && (
						<div className="flex items-center gap-2">
							<Building2 className="h-3 w-3 text-gray-500" />
							<span className="text-sm">
								{degreeInfo.institution.name}
								{degreeInfo.institution.district &&
									`, ${degreeInfo.institution.district.name}`}
							</span>
						</div>
					)}
					{degreeInfo.medicalSpeciality && (
						<div className="flex items-center gap-2">
							<Stethoscope className="h-3 w-3 text-gray-500" />
							<span className="text-sm">
								{degreeInfo.medicalSpeciality.name}
							</span>
						</div>
					)}
					{(degreeInfo.startDate || degreeInfo.endDate) && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Calendar className="h-3 w-3" />
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
					{degreeInfo.grade && <div>Grade: {degreeInfo.grade}</div>}
					{degreeInfo.description && (
						<p className="text-sm text-gray-600">{degreeInfo.description}</p>
					)}
				</div>
			),
		})) || [];

	const workplaceProperties: PropertyConfig[] =
		doctor.doctorWorkplaces?.map((workplace) => ({
			label: workplace.hospital?.name || workplace.institution?.name || "N/A",
			value: (
				<div className="space-y-2">
					<div>
						Position:{" "}
						{workplace.doctorPosition || workplace.teacherPosition || "N/A"}
					</div>
					{workplace.medicalSpeciality && (
						<div className="flex items-center gap-2">
							<Stethoscope className="h-3 w-3 text-gray-500" />
							<span className="text-sm">
								{workplace.medicalSpeciality.name}
							</span>
						</div>
					)}
					{workplace.hospital && (
						<div className="space-y-1">
							{workplace.hospital.district && (
								<div className="flex items-center gap-2">
									<MapPin className="h-3 w-3 text-gray-500" />
									<span className="text-sm">
										{workplace.hospital.district.name}
									</span>
								</div>
							)}
							{workplace.hospital.hospitalType && (
								<div className="flex items-center gap-2">
									<Building2 className="h-3 w-3 text-gray-500" />
									<span className="text-sm">
										{typeof workplace.hospital.hospitalType === "string"
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
							<Calendar className="h-3 w-3" />
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
			),
		})) || [];

	const associationProperties: PropertyConfig[] =
		doctor.doctorAssociations?.map((assocInfo) => ({
			label: assocInfo.association.name,
			value: (
				<div className="space-y-2">
					<div>
						{assocInfo.association.bnName}
						{assocInfo.association.shortName &&
							` (${assocInfo.association.shortName})`}
					</div>
					<div>
						Membership: {assocInfo.membershipType?.displayName || "Member"}
						{assocInfo.isActive && " • Active"}
					</div>
					{assocInfo.association.associationType && (
						<div className="flex items-center gap-2">
							<Building2 className="h-3 w-3 text-gray-500" />
							<span className="text-sm">
								{assocInfo.association.associationType.bnName ||
									assocInfo.association.associationType.displayName}
							</span>
						</div>
					)}
					{assocInfo.association.district && (
						<div className="flex items-center gap-2">
							<MapPin className="h-3 w-3 text-gray-500" />
							<span className="text-sm">
								{assocInfo.association.district.name}
							</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Calendar className="h-3 w-3" />
						<span>
							Member since: {new Date(assocInfo.startDate).toLocaleDateString()}
							{assocInfo.endDate &&
								` - ${new Date(assocInfo.endDate).toLocaleDateString()}`}
						</span>
					</div>
					{(assocInfo.association.email ||
						assocInfo.association.phone ||
						assocInfo.association.websiteUrl) && (
						<div className="space-y-1 pt-2 border-t">
							{assocInfo.association.email && (
								<div className="flex items-center gap-2">
									<Mail className="h-3 w-3 text-gray-500" />
									<span className="text-sm">{assocInfo.association.email}</span>
								</div>
							)}
							{assocInfo.association.phone && (
								<div className="flex items-center gap-2">
									<Phone className="h-3 w-3 text-gray-500" />
									<span className="text-sm">{assocInfo.association.phone}</span>
								</div>
							)}
							{assocInfo.association.websiteUrl && (
								<a
									href={assocInfo.association.websiteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 hover:underline flex items-center gap-2"
								>
									<Building2 className="h-3 w-3" />
									{assocInfo.association.websiteUrl}
								</a>
							)}
						</div>
					)}
				</div>
			),
		})) || [];

	const sections: SectionConfig[] = [
		{
			id: "profile",
			title: "Profile Information",
			icon: <User className="h-5 w-5" />,
			properties: profileProperties,
		},
		{
			id: "degrees",
			title: "Educational Qualifications",
			icon: <GraduationCap className="h-5 w-5" />,
			properties: degreesProperties,
			emptyMessage: "No educational qualifications found.",
		},
		{
			id: "workplaces",
			title: "Workplaces",
			icon: <Briefcase className="h-5 w-5" />,
			properties: workplaceProperties,
			emptyMessage: "No workplace information found.",
		},
		{
			id: "associations",
			title: "Professional Associations",
			icon: <Users className="h-5 w-5" />,
			properties: associationProperties,
			emptyMessage: "No professional associations found.",
		},
	];

	return buildDetailSections(sections);
}
