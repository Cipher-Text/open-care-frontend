"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Hospital } from "@/types/hospitals";

interface HospitalFiltersProps {
	onFilter: (hospitals: Hospital[]) => void;
	allHospitals: Hospital[];
}

export default function HospitalFilters({
	onFilter,
	allHospitals,
}: HospitalFiltersProps) {
	const [filters, setFilters] = useState({
		hospitalName: "",
		bengaliName: "",
		district: "all-districts",
		upazila: "all-upazilas",
		union: "all-unions",
		hospitalTypes: "all-types",
		organizationType: "all-organizations",
	});

	const handleFilterChange = (key: string, value: string) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		applyFilters(newFilters);
	};

	const applyFilters = (currentFilters: typeof filters) => {
		const filtered = allHospitals.filter((hospital) => {
			return (
				(!currentFilters.hospitalName ||
					hospital.name
						.toLowerCase()
						.includes(currentFilters.hospitalName.toLowerCase())) &&
				(!currentFilters.bengaliName ||
					hospital.bnName.includes(currentFilters.bengaliName)) &&
				(!currentFilters.district ||
					currentFilters.district === "all-districts" ||
					hospital.district.name === currentFilters.district) &&
				(!currentFilters.hospitalTypes ||
					currentFilters.hospitalTypes === "all-types" ||
					hospital.hospitalType === currentFilters.hospitalTypes) &&
				(!currentFilters.organizationType ||
					currentFilters.organizationType === "all-organizations" ||
					hospital.organizationType === currentFilters.organizationType)
			);
		});
		onFilter(filtered);
	};

	const clearFilters = () => {
		const clearedFilters = {
			hospitalName: "",
			bengaliName: "",
			district: "all-districts",
			upazila: "all-upazilas",
			union: "all-unions",
			hospitalTypes: "all-types",
			organizationType: "all-organizations",
		};
		setFilters(clearedFilters);
		onFilter(allHospitals);
	};

	return (
		<div className="bg-white border border-teal-200 rounded-xl p-6 h-fit sticky top-24">
			<h3 className="text-lg font-bold text-teal-700 mb-6">Filters</h3>

			<div className="space-y-5">
				{/* Hospital Name Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Hospital Name
					</label>
					<Input
						placeholder="Enter hospital name"
						value={filters.hospitalName}
						onChange={(e) => handleFilterChange("hospitalName", e.target.value)}
						className="border-gray-300 focus:border-teal-500"
					/>
				</div>

				{/* Bengali Name Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Bengali Name
					</label>
					<Input
						placeholder="বাংলা নাম"
						value={filters.bengaliName}
						onChange={(e) => handleFilterChange("bengaliName", e.target.value)}
						className="border-gray-300 focus:border-teal-500"
					/>
				</div>

				{/* District Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						District
					</label>
					<Select
						value={filters.district}
						onValueChange={(value) => handleFilterChange("district", value)}
					>
						<SelectTrigger className="border-gray-300 focus:border-teal-500">
							<SelectValue placeholder="Select district(s)" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-districts">All Districts</SelectItem>
							<SelectItem value="Dhaka">Dhaka</SelectItem>
							<SelectItem value="Chittagong">Chittagong</SelectItem>
							<SelectItem value="Sylhet">Sylhet</SelectItem>
							<SelectItem value="Rajshahi">Rajshahi</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Upazila Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Upazila
					</label>
					<Select
						value={filters.upazila}
						onValueChange={(value) => handleFilterChange("upazila", value)}
					>
						<SelectTrigger className="border-gray-300 focus:border-teal-500">
							<SelectValue placeholder="Select upazila" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-upazilas">All Upazilas</SelectItem>
							<SelectItem value="Dhaka Sadar">Dhaka Sadar</SelectItem>
							<SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
							<SelectItem value="Gulshan">Gulshan</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Union Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Union
					</label>
					<Select
						value={filters.union}
						onValueChange={(value) => handleFilterChange("union", value)}
					>
						<SelectTrigger className="border-gray-300 focus:border-teal-500">
							<SelectValue placeholder="Select union" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-unions">All Unions</SelectItem>
							<SelectItem value="Dhaka">Dhaka</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Hospital Types Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Hospital Types
					</label>
					<Select
						value={filters.hospitalTypes}
						onValueChange={(value) =>
							handleFilterChange("hospitalTypes", value)
						}
					>
						<SelectTrigger className="border-gray-300 focus:border-teal-500">
							<SelectValue placeholder="Select type(s)" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-types">All Types</SelectItem>
							<SelectItem value="General">General</SelectItem>
							<SelectItem value="Specialized">Specialized</SelectItem>
							<SelectItem value="College">College</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Organization Type Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Organization Type
					</label>
					<Select
						value={filters.organizationType}
						onValueChange={(value) =>
							handleFilterChange("organizationType", value)
						}
					>
						<SelectTrigger className="border-gray-300 focus:border-teal-500">
							<SelectValue placeholder="Select organization" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-organizations">
								All Organizations
							</SelectItem>
							<SelectItem value="Government">Government</SelectItem>
							<SelectItem value="Private">Private</SelectItem>
							<SelectItem value="Non-profit">Non-profit</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Filter Buttons */}
				<div className="flex gap-3 pt-4">
					<Button
						onClick={() => applyFilters(filters)}
						className="bg-teal-600 hover:bg-teal-700 text-white flex-1"
					>
						Apply
					</Button>
					<Button
						variant="outline"
						onClick={clearFilters}
						className="border-gray-300 text-gray-600 hover:bg-gray-50"
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	);
}
