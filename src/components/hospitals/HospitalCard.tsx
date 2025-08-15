"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Bed, Users } from "lucide-react";
import { Hospital } from "@/types/hospitals";

interface HospitalCardProps {
	hospital: Hospital & {
		doctors?: string;
		services?: string;
	};
}

const getOrganizationColor = (type: string) => {
	switch (type) {
		case "Government":
			return "bg-teal-600 text-white";
		case "Private":
			return "bg-emerald-600 text-white";
		case "Non-profit":
			return "bg-amber-500 text-white";
		default:
			return "bg-gray-500 text-white";
	}
};

const getHospitalTypeColor = (type: string) => {
	switch (type) {
		case "General":
			return "border-teal-500 text-teal-700";
		case "Specialized":
			return "border-teal-500 text-teal-700";
		case "College":
			return "border-teal-500 text-teal-700";
		default:
			return "border-gray-500 text-gray-700";
	}
};

export default function HospitalCard({ hospital }: HospitalCardProps) {
	return (
		<Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
			<CardContent className="p-6">
				<div className="flex gap-4">
					{/* Hospital Icon */}
					<div className="w-15 h-15 bg-teal-50 border-2 border-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
						<Building2 className="w-8 h-8 text-teal-700" />
					</div>

					<div className="flex-1">
						{/* Hospital Name and Bengali Name */}
						<h3 className="text-lg font-bold text-gray-900 mb-1">
							{hospital.name}
						</h3>
						<p className="text-sm text-teal-600 mb-3">{hospital.bnName}</p>

						{/* Badges */}
						<div className="flex gap-2 mb-3">
							<Badge
								variant="outline"
								className={getHospitalTypeColor(hospital.hospitalType)}
							>
								{hospital.hospitalType}
							</Badge>
							<Badge
								className={getOrganizationColor(hospital.organizationType)}
							>
								{hospital.organizationType}
							</Badge>
						</div>

						{/* Hospital Info */}
						<div className="space-y-1 mb-4 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<Bed className="w-4 h-4" />
								<span>
									{hospital.numberOfBed} Beds • {hospital.district.name}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4" />
								<span>
									{hospital.doctors || "N/A"} Doctors •{" "}
									{hospital.services || "Full Service"}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<Button className="bg-teal-600 hover:bg-teal-700 text-white">
								Find Doctors
							</Button>
							<Button
								variant="outline"
								className="border-teal-500 text-teal-700 hover:bg-teal-50"
							>
								View Details
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
