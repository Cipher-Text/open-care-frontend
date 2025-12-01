"use client";

import {
	Building2,
	Globe,
	MapPin,
	Bed,
	Tag as TagIcon,
	Stethoscope,
	FlaskConical,
	Sparkles,
	DollarSign,
	CheckCircle,
	XCircle,
	Package,
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
			value: hospital.websiteUrl ? (
				<a
					href={hospital.websiteUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{hospital.websiteUrl}
				</a>
			) : (
				"N/A"
			),
			icon: <Globe className="h-4 w-4" />,
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
		{ label: "Latitude", value: hospital.lat || "N/A" },
		{ label: "Longitude", value: hospital.lon || "N/A" },
	];

	const doctorsProperties: PropertyConfig[] =
		hospital.doctors?.map((doctor) => ({
			label: doctor.profile.name,
			value: (
				<div className="space-y-2">
					<div className="text-sm text-gray-600">{doctor.profile.bnName}</div>
					<div className="flex items-center gap-2">
						<span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
							{doctor.bmdcNo}
						</span>
						{doctor.isVerified && (
							<span className="text-xs text-green-600 flex items-center gap-1">
								<CheckCircle className="h-3 w-3" /> Verified
							</span>
						)}
					</div>
					{doctor.specializations && (
						<div className="flex items-center gap-2">
							<Stethoscope className="h-3 w-3 text-gray-500" />
							<span className="text-sm">{doctor.specializations}</span>
						</div>
					)}
					{doctor.yearOfExperience && (
						<div className="text-sm text-gray-600">
							{doctor.yearOfExperience} years experience
						</div>
					)}
					{(doctor.profile.email || doctor.profile.phone) && (
						<div className="space-y-1 pt-2 border-t text-xs text-gray-600">
							{doctor.profile.email && <div>{doctor.profile.email}</div>}
							{doctor.profile.phone && <div>{doctor.profile.phone}</div>}
						</div>
					)}
				</div>
			),
		})) || [];

	const testsProperties: PropertyConfig[] =
		hospital.tests?.map((test) => ({
			label: test.name,
			value: (
				<div className="space-y-2">
					<div className="text-sm text-gray-600">{test.medicalTest.bnName}</div>
					<div className="flex items-center gap-2">
						<span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
							৳{test.price.toLocaleString()}
						</span>
						{test.isActive ? (
							<span className="text-xs text-green-600">Active</span>
						) : (
							<span className="text-xs text-red-600">Inactive</span>
						)}
					</div>
					{test.category && (
						<div className="text-sm text-gray-600">
							Category: {test.category}
						</div>
					)}
					{test.testCode && (
						<div className="text-xs text-gray-600">Code: {test.testCode}</div>
					)}
					<div className="text-sm">
						{test.isAvailable ? (
							<span className="text-green-600 flex items-center gap-1">
								<CheckCircle className="h-3 w-3" /> Available
							</span>
						) : (
							<span className="text-red-600 flex items-center gap-1">
								<XCircle className="h-3 w-3" /> Not Available
							</span>
						)}
					</div>
					{test.description && (
						<p className="text-sm text-gray-600 pt-2 border-t">
							{test.description}
						</p>
					)}
				</div>
			),
		})) || [];

	const amenitiesProperties: PropertyConfig[] =
		hospital.amenities?.map((amenity) => ({
			label: amenity.name,
			value: (
				<div className="space-y-2">
					<div className="text-xs text-gray-600">
						{amenity.type.replace(/_/g, " ")}
					</div>
					{amenity.price > 0 && (
						<div className="flex items-center gap-2">
							<DollarSign className="h-3 w-3 text-gray-500" />
							<span className="text-sm font-semibold">
								৳{amenity.price.toLocaleString()}
							</span>
						</div>
					)}
					<div className="flex items-center gap-4 text-sm">
						<span className="flex items-center gap-1">
							<Package className="h-3 w-3" /> Total: {amenity.quantity}
						</span>
						<span className="flex items-center gap-1 text-green-600">
							<CheckCircle className="h-3 w-3" /> {amenity.available}
						</span>
					</div>
					{amenity.isActive ? (
						<span className="text-xs text-green-600">Active</span>
					) : (
						<span className="text-xs text-red-600">Inactive</span>
					)}
				</div>
			),
		})) || [];

	const tagsProperties: PropertyConfig[] =
		hospital.tags?.map((tag) => ({
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
			id: "location",
			title: "Location Information",
			icon: <MapPin className="h-5 w-5" />,
			properties: locationProperties,
		},
		{
			id: "doctors",
			title: `Doctors (${hospital.doctors?.length || 0})`,
			icon: <Stethoscope className="h-5 w-5" />,
			properties: doctorsProperties,
			emptyMessage: "No doctors found.",
		},
		{
			id: "tests",
			title: `Medical Tests (${hospital.tests?.length || 0})`,
			icon: <FlaskConical className="h-5 w-5" />,
			properties: testsProperties,
			emptyMessage: "No medical tests found.",
		},
		{
			id: "amenities",
			title: `Amenities & Services (${hospital.amenities?.length || 0})`,
			icon: <Sparkles className="h-5 w-5" />,
			properties: amenitiesProperties,
			emptyMessage: "No amenities or services found.",
		},
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
