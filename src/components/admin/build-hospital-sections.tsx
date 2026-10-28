"use client";

import {
	Building2,
	Globe,
	MapPin,
	Bed,
	Sparkles,
	CheckCircle,
	XCircle,
	Mail,
	Phone,
	Share2,
} from "lucide-react";
import { HospitalDetailsResponse } from "@/types/hospitals";
import {
	buildDetailSections,
	SectionConfig,
	PropertyConfig,
} from "./build-detail-sections";
import { DetailSection } from "./detail-view";

export function buildHospitalDetailSections(
	hospital: HospitalDetailsResponse
): DetailSection[] {
	const formatValue = (value: string | number | null | undefined) =>
		value === null || value === undefined || value === "" ? "N/A" : value;
	const formatLinkValue = (value: string | null | undefined) => {
		if (!value) {
			return "N/A";
		}
		const href = value.startsWith("http") ? value : `https://${value}`;
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{value}
			</a>
		);
	};
	const formatBoolean = (value: boolean | null | undefined) => {
		if (value === null || value === undefined) {
			return "N/A";
		}
		return value ? (
			<span className="text-xs text-success flex items-center gap-1">
				<CheckCircle className="h-3 w-3" /> Yes
			</span>
		) : (
			<span className="text-xs text-destructive flex items-center gap-1">
				<XCircle className="h-3 w-3" /> No
			</span>
		);
	};

	const basicProperties: PropertyConfig[] = [
		{ label: "Name", value: hospital.name || "N/A" },
		{ label: "Bengali Name", value: hospital.bnName || "N/A" },
		{
			label: "Hospital Type",
			value:
				hospital.hospitalType?.englishName ||
				hospital.hospitalType?.banglaName ||
				"N/A",
		},
		{
			label: "Organization Type",
			value:
				hospital.organizationType?.displayName ||
				hospital.organizationType?.banglaName ||
				"N/A",
		},
		{
			label: "Number of Beds",
			value: hospital.numberOfBed?.toLocaleString() || "N/A",
			icon: <Bed className="h-4 w-4" />,
		},
		{
			label: "Website",
			value: formatLinkValue(hospital.websiteUrl),
			icon: <Globe className="h-4 w-4" />,
		},
		{
			label: "Registration Code",
			value: formatValue(hospital.registrationCode),
		},
		{
			label: "Email",
			value: formatValue(hospital.email),
			icon: <Mail className="h-4 w-4" />,
		},
		{
			label: "Phone",
			value: formatValue(hospital.phone),
			icon: <Phone className="h-4 w-4" />,
		},
		{
			label: "Address",
			value: formatValue(hospital.address),
		},
		{
			label: "Facebook Page",
			value: formatLinkValue(hospital.facebookPageUrl),
			icon: <Share2 className="h-4 w-4" />,
		},
		{
			label: "Twitter Profile",
			value: formatLinkValue(hospital.twitterProfileUrl),
			icon: <Share2 className="h-4 w-4" />,
		},
	];

	const locationProperties: PropertyConfig[] = [
		{
			label: "District",
			value: hospital.district?.name || "N/A",
			icon: <MapPin className="h-4 w-4" />,
		},
		{ label: "Upazila", value: hospital.upazila?.name || "N/A" },
		{ label: "Union", value: hospital.union?.name || "N/A" },
		{
			label: "Division",
			value: hospital.district?.division?.name || "N/A",
		},
		{ label: "Latitude", value: formatValue(hospital.lat) },
		{ label: "Longitude", value: formatValue(hospital.lon) },
	];

	const serviceProperties: PropertyConfig[] = [
		{
			label: "Emergency Service",
			value: formatBoolean(hospital.hasEmergencyService),
		},
		{
			label: "Ambulance Service",
			value: formatBoolean(hospital.hasAmbulanceService),
		},
		{
			label: "Blood Bank",
			value: formatBoolean(hospital.hasBloodBank),
		},
		{
			label: "Affiliated",
			value: formatBoolean(hospital.isAffiliated),
		},
		{
			label: "Verified",
			value: formatBoolean(hospital.isVerified),
		},
		{
			label: "Active",
			value: formatBoolean(hospital.isActive),
		},
	];

	const sections: SectionConfig[] = [
		{
			id: "basic",
			title: "Basic Information",
			icon: <Building2 className="h-5 w-5" />,
			properties: basicProperties,
		},
		{
			id: "location",
			title: "Location Information",
			icon: <MapPin className="h-5 w-5" />,
			properties: locationProperties,
		},
		{
			id: "services",
			title: "Services & Status",
			icon: <Sparkles className="h-5 w-5" />,
			properties: serviceProperties,
		},
	];

	// Doctors, medical tests, amenities and tags are managed on the page itself (components/admin/hospital).
	return buildDetailSections(sections);
}
