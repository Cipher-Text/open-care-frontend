"use client";

import {
	Building2,
	Mail,
	Phone,
	Globe,
	MapPin,
	Calendar,
	Users,
	Tag as TagIcon,
	GraduationCap,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { Institution } from "@/types/institutions";
import { buildDetailSections, SectionConfig, PropertyConfig } from "./build-detail-sections";
import { DetailSection } from "./detail-view";

export function buildInstitutionDetailSections(
	institution: Institution
): DetailSection[] {
	const basicProperties: PropertyConfig[] = [
		{ label: "Name", value: institution.name || "N/A" },
		{ label: "Bengali Name", value: institution.bnName || "N/A" },
		{ label: "Acronym", value: institution.acronym || "N/A" },
		{
			label: "Institution Type",
			value:
				institution.institutionType?.englishName ||
				institution.institutionType?.banglaName ||
				"N/A",
		},
		{
			label: "Organization Type",
			value:
				institution.organizationType?.displayName ||
				institution.organizationType?.banglaName ||
				"N/A",
		},
		{
			label: "Affiliation Status",
			value: institution.affiliated ? (
				<span className="text-green-600 flex items-center gap-1">
					<CheckCircle className="h-3 w-3" /> Affiliated
				</span>
			) : (
				<span className="text-red-600 flex items-center gap-1">
					<XCircle className="h-3 w-3" /> Not Affiliated
				</span>
			),
		},
	];

	const academicProperties: PropertyConfig[] = [
		{
			label: "Established Year",
			value: institution.establishedYear || "N/A",
			icon: <Calendar className="h-4 w-4" />,
		},
		{
			label: "Enrollment",
			value: institution.enroll !== undefined && institution.enroll !== null
				? `${institution.enroll} students`
				: "N/A",
			icon: <Users className="h-4 w-4" />,
		},
	];

	const contactProperties: PropertyConfig[] = [
		{
			label: "Email",
			value: institution.email ? (
				<a
					href={`mailto:${institution.email}`}
					className="text-blue-600 hover:underline"
				>
					{institution.email}
				</a>
			) : "N/A",
			icon: <Mail className="h-4 w-4" />,
		},
		{
			label: "Phone",
			value: institution.phone || "N/A",
			icon: <Phone className="h-4 w-4" />,
		},
		{
			label: "Website",
			value: institution.websiteUrl ? (
				<a
					href={institution.websiteUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{institution.websiteUrl}
				</a>
			) : "N/A",
			icon: <Globe className="h-4 w-4" />,
		},
		{ label: "Address", value: institution.address || "N/A", icon: <MapPin className="h-4 w-4" /> },
	];

	const locationProperties: PropertyConfig[] = [
		{
			label: "Country",
			value:
				institution.country?.displayNameEn ||
				institution.country?.nameBn ||
				"N/A",
			icon: <MapPin className="h-4 w-4" />,
		},
		{ label: "District", value: institution.district?.name || "N/A" },
		{ label: "Upazila", value: institution.upazila?.name || "N/A" },
		{ label: "Latitude", value: institution.lat || "N/A" },
		{ label: "Longitude", value: institution.lon || "N/A" },
	];

	const affiliatedHospitalProperties: PropertyConfig[] = institution.affiliatedHospital
		? [
				{
					label: "Hospital Name",
					value: (
						<div className="space-y-1">
							<div className="font-semibold">{institution.affiliatedHospital.name}</div>
							<div className="text-sm text-gray-600">
								{institution.affiliatedHospital.bnName}
							</div>
						</div>
					),
				},
				{
					label: "Number of Beds",
					value: institution.affiliatedHospital.numberOfBed || "N/A",
				},
				{
					label: "Hospital Type",
					value:
						institution.affiliatedHospital.hospitalType?.englishName ||
						institution.affiliatedHospital.hospitalType?.banglaName ||
						"N/A",
				},
				{
					label: "Location",
					value: institution.affiliatedHospital.district?.name || "N/A",
					icon: <MapPin className="h-4 w-4" />,
				},
				{
					label: "Website",
					value: institution.affiliatedHospital.websiteUrl ? (
						<a
							href={institution.affiliatedHospital.websiteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							{institution.affiliatedHospital.websiteUrl}
						</a>
					) : "N/A",
					icon: <Globe className="h-4 w-4" />,
				},
		  ]
		: [];

	const tagsProperties: PropertyConfig[] = institution.tags?.map((tag) => ({
		label: tag.displayName || tag.name,
		value: <span className="text-xs text-gray-600">{tag.category}</span>,
	})) || [];

	const sections: SectionConfig[] = [
		{
			id: "basic",
			title: "Basic Information",
			icon: <Building2 className="h-5 w-5" />,
			properties: basicProperties,
		},
		{
			id: "academic",
			title: "Academic Information",
			icon: <GraduationCap className="h-5 w-5" />,
			properties: academicProperties,
		},
		{
			id: "contact",
			title: "Contact Information",
			icon: <Mail className="h-5 w-5" />,
			properties: contactProperties,
		},
		{
			id: "location",
			title: "Location Information",
			icon: <MapPin className="h-5 w-5" />,
			properties: locationProperties,
		},
		...(affiliatedHospitalProperties.length > 0
			? [
					{
						id: "affiliated-hospital",
						title: "Affiliated Hospital",
						icon: <Building2 className="h-5 w-5" />,
						properties: affiliatedHospitalProperties,
					},
			  ]
			: []),
		{
			id: "tags",
			title: "Tags",
			icon: <TagIcon className="h-5 w-5" />,
			properties: tagsProperties,
			emptyMessage: "No tags found.",
		},
	];

	return buildDetailSections(sections);
}
