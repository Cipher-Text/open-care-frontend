"use client";

import { useState } from "react";
import HospitalFilters from "@/components/hospitals/HospitalFilters";
import HospitalsList from "@/components/hospitals/HospitalsList";
import { Hospital } from "@/types/hospitals";

// Simplified mock data for hospitals based on the UI design
const mockHospitals = [
  {
    id: 1,
    name: "Dhaka Medical College",
    bnName: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    numberOfBed: 1700,
    hospitalType: {
      value: "COLLEGE",
      banglaName: "কলেজ",
      englishName: "College",
    },
    organizationType: {
      value: "GOVERNMENT",
      displayName: "Government",
      banglaName: "সরকারি",
      description: "Government Hospital",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://dmc.edu.bd",
    tags: [],
    doctors: "500+",
    services: "24/7 Emergency",
  },
  {
    id: 2,
    name: "Square Hospital",
    bnName: "স্কয়ার হাসপাতাল",
    numberOfBed: 650,
    hospitalType: {
      value: "GENERAL",
      banglaName: "সাধারণ",
      englishName: "General",
    },
    organizationType: {
      value: "PRIVATE",
      displayName: "Private",
      banglaName: "বেসরকারি",
      description: "Private Hospital",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://squarehospital.com",
    tags: [],
    doctors: "300+",
    services: "Premium Care",
  },
  {
    id: 3,
    name: "Apollo Hospital",
    bnName: "অ্যাপোলো হাসপাতাল",
    numberOfBed: 650,
    hospitalType: {
      value: "SPECIALIZED",
      banglaName: "বিশেষায়িত",
      englishName: "Specialized",
    },
    organizationType: {
      value: "PRIVATE",
      displayName: "Private",
      banglaName: "বেসরকারি",
      description: "Private Hospital",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://apollodhaka.com",
    tags: [],
    doctors: "250+",
    services: "Advanced Care",
  },
  {
    id: 4,
    name: "BIRDEM General",
    bnName: "বারডেম জেনারেল হাসপাতাল",
    numberOfBed: 750,
    hospitalType: {
      value: "SPECIALIZED",
      banglaName: "বিশেষায়িত",
      englishName: "Specialized",
    },
    organizationType: {
      value: "NON_PROFIT",
      displayName: "Non-profit",
      banglaName: "অলাভজনক",
      description: "Non-profit Organization",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://birdem.org.bd",
    tags: [],
    doctors: "400+",
    services: "Diabetes Care",
  },
  {
    id: 5,
    name: "United Hospital",
    bnName: "ইউনাইটেড হাসপাতাল",
    numberOfBed: 600,
    hospitalType: {
      value: "GENERAL",
      banglaName: "সাধারণ",
      englishName: "General",
    },
    organizationType: {
      value: "PRIVATE",
      displayName: "Private",
      banglaName: "বেসরকারি",
      description: "Private Hospital",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://uhl.com.bd",
    tags: [],
    doctors: "350+",
    services: "ICU Facility",
  },
  {
    id: 6,
    name: "National Hospital",
    bnName: "ন্যাশনাল হাসপাতাল",
    numberOfBed: 500,
    hospitalType: {
      value: "GENERAL",
      banglaName: "সাধারণ",
      englishName: "General",
    },
    organizationType: {
      value: "GOVERNMENT",
      displayName: "Government",
      banglaName: "সরকারি",
      description: "Government Hospital",
    },
    district: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
      lat: "23.7465",
      lon: "90.3776",
      url: "",
    },
    upazila: {
      id: 1,
      name: "Dhaka Sadar",
      bnName: "ঢাকা সদর",
      district: {
        id: 1,
        name: "Dhaka",
        bnName: "ঢাকা",
        division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
        lat: "23.7465",
        lon: "90.3776",
        url: "",
      },
      url: "",
    },
    union: {
      id: 1,
      name: "Dhaka",
      bnName: "ঢাকা",
      upazila: {
        id: 1,
        name: "Dhaka Sadar",
        bnName: "ঢাকা সদর",
        district: {
          id: 1,
          name: "Dhaka",
          bnName: "ঢাকা",
          division: { id: 1, name: "Dhaka", bnName: "ঢাকা", url: "" },
          lat: "23.7465",
          lon: "90.3776",
          url: "",
        },
        url: "",
      },
      url: "",
    },
    lat: "23.7465",
    lon: "90.3776",
    websiteUrl: "https://nationalhospital.gov.bd",
    tags: [],
    doctors: "450+",
    services: "Trauma Center",
  },
] as (Hospital & { doctors?: string; services?: string })[];

export default function HospitalsPage() {
  const [filteredHospitals, setFilteredHospitals] = useState(mockHospitals);
  const [currentPage, setCurrentPage] = useState(1);
  const hospitalsPerPage = 6;

  const totalResults = 245; // Based on UI design
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Find Hospitals</h1>
            <p className="text-lg mb-2">
              Search and filter hospitals by location, type, and organization
            </p>
            <p className="text-sm">
              📍 Dhaka, Bangladesh • 🏥 {totalResults} hospitals available
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <HospitalFilters
              onFilter={setFilteredHospitals}
              allHospitals={mockHospitals}
            />
          </div>

          {/* Hospitals List */}
          <div className="flex-1">
            <HospitalsList
              hospitals={currentHospitals}
              totalResults={totalResults}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={Math.ceil(totalResults / hospitalsPerPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
