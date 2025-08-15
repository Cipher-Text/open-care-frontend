import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorsList from "@/components/doctors/DoctorsList";

// Mock data for doctors
const mockDoctors = [
	{
		id: "1",
		name: "Dr. Ahmed Rahman",
		experience: 15,
		rating: 4.8,
		reviews: 324,
		availability: "Available Today",
		responseTime: "Responds within 2 hours",
		degrees: ["MBBS", "MD Cardiology", "FCPS"],
		specialties: ["Cardiology", "Heart Surgery", "Interventional Cardiology"],
		hospital: "Dhaka Medical College Hospital",
		location: "Dhaka",
		consultationFee: 1500,
		nextAvailable: "Next available: Today 3:30 PM - 6:00 PM",
		availabilityStatus: "available" as const,
	},
	{
		id: "2",
		name: "Dr. Fatima Khan",
		experience: 8,
		rating: 4.9,
		reviews: 189,
		availability: "Available Tomorrow",
		responseTime: "Responds within 1 hour",
		degrees: ["MBBS", "MS Gynecology", "FCPS", "Fellowship"],
		specialties: ["Gynecology", "Obstetrics", "Maternal-Fetal Medicine"],
		hospital: "Square Hospital",
		location: "Dhaka",
		consultationFee: 1200,
		nextAvailable: "Next available: Tomorrow 10:00 AM - 1:00 PM",
		availabilityStatus: "busy" as const,
	},
	{
		id: "3",
		name: "Dr. Michael Chen",
		experience: 22,
		rating: 4.7,
		reviews: 456,
		availability: "Available Today",
		responseTime: "Responds within 3 hours",
		degrees: ["MBBS", "MD Orthopedics", "FRCS"],
		specialties: ["Orthopedic Surgery", "Sports Medicine", "Joint Replacement"],
		hospital: "United Hospital",
		location: "Dhaka",
		consultationFee: 2000,
		nextAvailable: "Next available: Today 2:00 PM - 5:30 PM",
		availabilityStatus: "available" as const,
	},
	{
		id: "4",
		name: "Dr. Rashida Begum",
		experience: 12,
		rating: 4.6,
		reviews: 278,
		availability: "Available Tomorrow",
		responseTime: "Responds within 1 hour",
		degrees: ["MBBS", "MS Pediatrics", "FCPS"],
		specialties: ["Pediatrics", "Child Development", "Neonatology"],
		hospital: "Bangladesh Specialized Hospital",
		location: "Dhaka",
		consultationFee: 1000,
		nextAvailable: "Next available: Tomorrow 9:00 AM - 12:00 PM",
		availabilityStatus: "busy" as const,
	},
];

export default function DoctorsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-teal-600 to-teal-700 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center text-white">
						<h1 className="text-3xl font-bold mb-2">Find Your Doctor</h1>
						<p className="text-lg mb-2">
							Browse through our network of qualified healthcare professionals
						</p>
						<p className="text-sm">
							📍 Dhaka, Bangladesh • 🏥 1,234 verified doctors available
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Filters */}
				<DoctorFilters />

				{/* Doctors List */}
				<DoctorsList doctors={mockDoctors} totalResults={129} />
			</div>
		</div>
	);
}
