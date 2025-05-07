import axios from "axios";
import config from "../config";
import {
  BlogPost,
  Doctor,
  User,
  HospitalResponse,
  InstitutionResponse,
  DoctorResponse,
  Hospital,
} from "../types";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctors = async (
  page = 0,
  size = config.itemsPerPage,
  filters = {}
) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  // Add pagination parameters
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());

  // Add filter parameters if they exist
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await apiClient.get<DoctorResponse>(
    `/api/doctors?${queryParams.toString()}`
  );
  return response.data;
};

export const fetchDoctorById = async (id: string | number) => {
  const response = await apiClient.get<Doctor>(`/api/doctors/${id}`);
  return response.data;
};

export const fetchHospitals = async (
  page = 0, // 0-based page index
  size = config.itemsPerPage,
  districtIds?: number,
  hospitalTypes?: string,
  organizationType?: string,
  name?: string
) => {
  let url = `/api/hospitals?page=${page}&size=${size}`;

  if (name) {
    url += `&name=${encodeURIComponent(name)}`;
  }

  if (districtIds) {
    url += `&districtIds=${districtIds}`;
  }

  if (hospitalTypes) {
    url += `&hospitalTypes=${hospitalTypes}`;
  }

  if (organizationType) {
    url += `&organizationType=${organizationType}`;
  }

  const response = await apiClient.get<HospitalResponse>(url);
  return response.data;
};

// Get all available degrees
export const fetchDegrees = async () => {
  const response = await apiClient.get("/api/degrees");
  return response.data;
};

// Get all medical specialities
export const fetchMedicalSpecialities = async () => {
  const response = await apiClient.get("/api/medical-specialities");
  return response.data;
};

// Add these functions to your services/api.ts file

export const fetchHospitalById = async (id: number) => {
  const response = await apiClient.get<Hospital>(`/api/hospitals/${id}`);
  return response.data;
};

export const fetchDoctorsByHospital = async (
  hospitalId: number,
  page = 0,
  size = config.itemsPerPage
) => {
  const response = await apiClient.get<{
    doctors: Doctor[];
    totalItems: number;
  }>(`/api/doctors?hospitalId=${hospitalId}&page=${page}&size=${size}`);
  return response.data;
};

export const fetchInstitutions = async (
  page = 0, // 0-based page index
  size = config.itemsPerPage,
  districtIds?: number,
  hospitalTypes?: string,
  organizationType?: string
) => {
  let url = `/api/institutions?page=${page}&size=${size}`;

  if (districtIds) {
    url += `&districtIds=${districtIds}`;
  }

  if (hospitalTypes) {
    url += `&hospitalTypes=${hospitalTypes}`;
  }

  if (organizationType) {
    url += `&organizationType=${organizationType}`;
  }

  const response = await apiClient.get<InstitutionResponse>(url);

  return response.data;
};

export const fetchUserProfile = async () => {
  // Assuming you have some authentication mechanism
  const response = await apiClient.get<User>("/profile");
  return response.data;
};

export const fetchFeaturedData = async () => {
  const response = await apiClient.get("/featured");
  return response.data;
};

export const fetchLatestBlogs = async () => {
  const response = await apiClient.get<{ data: BlogPost[]; total: number }>(
    "/blogs"
  );
  return response.data;
};
