import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Star,
	Clock,
	MessageCircle,
	Calendar,
	Eye,
	UserCheck,
	Building2,
	MapPin,
	DollarSign,
} from "lucide-react";

interface Doctor {
	id: string;
	name: string;
	image?: string;
	experience: number;
	rating: number;
	reviews: number;
	availability: string;
	responseTime: string;
	degrees: string[];
	specialties: string[];
	hospital: string;
	location: string;
	consultationFee: number;
	nextAvailable: string;
	availabilityStatus: "available" | "busy" | "unavailable";
}

interface DoctorCardProps {
	doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
	const getAvailabilityColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "available today":
				return "bg-green-50 border-green-200 text-green-700";
			case "available tomorrow":
				return "bg-yellow-50 border-yellow-200 text-yellow-700";
			default:
				return "bg-gray-50 border-gray-200 text-gray-700";
		}
	};

	const getStatusIcon = (name: string) => {
		// Simple logic to assign different colors based on doctor name
		if (name.includes("Ahmed"))
			return "text-teal-600 bg-teal-50 border-teal-600";
		if (name.includes("Fatima")) return "text-red-600 bg-red-50 border-red-600";
		if (name.includes("Michael"))
			return "text-gray-600 bg-gray-50 border-gray-600";
		if (name.includes("Rashida"))
			return "text-yellow-600 bg-yellow-50 border-yellow-600";
		return "text-teal-600 bg-teal-50 border-teal-600";
	};

	return (
		<Card className="w-full border border-gray-200 hover:shadow-lg transition-shadow">
			<CardContent className="p-6">
				<div className="flex gap-6">
					{/* Doctor Image */}
					<div
						className={`w-30 h-30 rounded-xl border-2 flex items-center justify-center ${getStatusIcon(
							doctor.name
						)}`}
					>
						<UserCheck className="w-12 h-12" />
					</div>

					{/* Doctor Info */}
					<div className="flex-1">
						{/* Header */}
						<div className="flex items-start justify-between mb-3">
							<div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{doctor.name}
								</h3>

								{/* Experience Badge */}
								<Badge
									variant="outline"
									className="bg-green-50 border-green-500 text-green-700 mb-3"
								>
									{doctor.experience} Years Experience
								</Badge>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<Button className="bg-teal-600 hover:bg-teal-700 text-white">
									<Calendar className="w-4 h-4 mr-2" />
									Book Appointment
								</Button>
								<Button
									variant="outline"
									className="border-teal-600 text-teal-600 hover:bg-teal-50"
								>
									<Eye className="w-4 h-4 mr-2" />
									View Profile
								</Button>
								<Button
									variant="outline"
									className="border-gray-400 text-gray-600 hover:bg-gray-50"
								>
									<MessageCircle className="w-4 h-4 mr-2" />
									Message
								</Button>
							</div>
						</div>

						{/* Rating and Availability */}
						<div className="flex items-center gap-4 mb-3">
							<div className="flex items-center">
								<Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
								<span className="font-medium text-gray-900">
									{doctor.rating}
								</span>
								<span className="text-gray-600 ml-1">
									({doctor.reviews} reviews)
								</span>
							</div>
							<span className="text-gray-400">•</span>
							<span className="text-gray-600">{doctor.availability}</span>
							<span className="text-gray-400">•</span>
							<div className="flex items-center text-teal-600">
								<MessageCircle className="w-4 h-4 mr-1" />
								<span className="text-sm">{doctor.responseTime}</span>
							</div>
						</div>

						{/* Degrees */}
						<div className="flex items-center gap-2 mb-3">
							<span className="text-sm font-semibold text-gray-600">
								Degrees:
							</span>
							<div className="flex gap-2">
								{doctor.degrees.map((degree, index) => (
									<Badge
										key={index}
										className={`text-white text-xs ${
											index === 0
												? "bg-teal-600"
												: index === 1
												? "bg-teal-700"
												: "bg-teal-800"
										}`}
									>
										{degree}
									</Badge>
								))}
							</div>
						</div>

						{/* Specialties */}
						<div className="flex items-center gap-2 mb-3">
							<span className="text-sm font-semibold text-gray-600">
								Specialties:
							</span>
							<div className="flex items-center gap-1">
								{doctor.specialties.map((specialty, index) => (
									<span key={index} className="flex items-center">
										<span className="text-sm text-gray-900">{specialty}</span>
										{index < doctor.specialties.length - 1 && (
											<span className="text-gray-400 mx-2">•</span>
										)}
									</span>
								))}
							</div>
						</div>

						{/* Hospital and Fee */}
						<div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
							<div className="flex items-center">
								<Building2 className="w-4 h-4 mr-1" />
								<span>{doctor.hospital}</span>
							</div>
							<span className="text-gray-400">•</span>
							<div className="flex items-center">
								<MapPin className="w-4 h-4 mr-1" />
								<span>{doctor.location}</span>
							</div>
							<span className="text-gray-400">•</span>
							<div className="flex items-center">
								<DollarSign className="w-4 h-4 mr-1" />
								<span>
									Consultation: ৳{doctor.consultationFee.toLocaleString()}
								</span>
							</div>
						</div>

						{/* Next Available Slot */}
						<div
							className={`p-3 rounded-lg border ${getAvailabilityColor(
								doctor.availability
							)}`}
						>
							<div className="flex items-center">
								<Clock className="w-4 h-4 mr-2" />
								<span className="text-sm font-medium">
									{doctor.nextAvailable}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
