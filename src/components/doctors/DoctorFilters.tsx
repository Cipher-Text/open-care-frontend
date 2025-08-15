import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	Building2,
	Stethoscope,
	Calendar,
	DollarSign,
	Star,
} from "lucide-react";

export default function DoctorFilters() {
	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
			<div className="flex flex-col lg:flex-row gap-4 items-center">
				{/* Search Bar */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<Input
						placeholder="Search doctors by name, specialty, or hospital..."
						className="pl-10 h-10 border-gray-300 focus:border-teal-500"
					/>
				</div>

				{/* Filter Buttons */}
				<div className="flex flex-wrap gap-3">
					<Select>
						<SelectTrigger className="w-32 h-10 border-teal-600 text-teal-600">
							<Building2 className="w-4 h-4 mr-2" />
							<SelectValue placeholder="All Hospitals" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Hospitals</SelectItem>
							<SelectItem value="dhaka-medical">
								Dhaka Medical College
							</SelectItem>
							<SelectItem value="square">Square Hospital</SelectItem>
							<SelectItem value="united">United Hospital</SelectItem>
							<SelectItem value="bangladesh-specialized">
								Bangladesh Specialized
							</SelectItem>
						</SelectContent>
					</Select>

					<Select>
						<SelectTrigger className="w-32 h-10 border-teal-600 text-teal-600">
							<Stethoscope className="w-4 h-4 mr-2" />
							<SelectValue placeholder="Specialties" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Specialties</SelectItem>
							<SelectItem value="cardiology">Cardiology</SelectItem>
							<SelectItem value="gynecology">Gynecology</SelectItem>
							<SelectItem value="orthopedics">Orthopedics</SelectItem>
							<SelectItem value="pediatrics">Pediatrics</SelectItem>
							<SelectItem value="neurology">Neurology</SelectItem>
						</SelectContent>
					</Select>

					<Select>
						<SelectTrigger className="w-32 h-10 border-teal-600 text-teal-600">
							<Calendar className="w-4 h-4 mr-2" />
							<SelectValue placeholder="Available" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Times</SelectItem>
							<SelectItem value="today">Available Today</SelectItem>
							<SelectItem value="tomorrow">Available Tomorrow</SelectItem>
							<SelectItem value="this-week">This Week</SelectItem>
						</SelectContent>
					</Select>

					<Select>
						<SelectTrigger className="w-32 h-10 border-teal-600 text-teal-600">
							<DollarSign className="w-4 h-4 mr-2" />
							<SelectValue placeholder="Fee Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Fees</SelectItem>
							<SelectItem value="0-1000">৳0 - ৳1,000</SelectItem>
							<SelectItem value="1000-1500">৳1,000 - ৳1,500</SelectItem>
							<SelectItem value="1500-2000">৳1,500 - ৳2,000</SelectItem>
							<SelectItem value="2000+">৳2,000+</SelectItem>
						</SelectContent>
					</Select>

					<Select>
						<SelectTrigger className="w-24 h-10 border-teal-600 text-teal-600">
							<Star className="w-4 h-4 mr-2" />
							<SelectValue placeholder="Rating" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="4.5+">4.5+</SelectItem>
							<SelectItem value="4.0+">4.0+</SelectItem>
							<SelectItem value="3.5+">3.5+</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Sort Dropdown */}
				<Select>
					<SelectTrigger className="w-40 h-10 bg-teal-600 text-white border-teal-600">
						<SelectValue placeholder="Sort by Rating" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="rating">Sort by Rating</SelectItem>
						<SelectItem value="fee-low">Fee: Low to High</SelectItem>
						<SelectItem value="fee-high">Fee: High to Low</SelectItem>
						<SelectItem value="experience">Experience</SelectItem>
						<SelectItem value="availability">Availability</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
