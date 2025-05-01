import axios from "axios";
import config from "../config";
import {
  BlogPost,
  Doctor,
  User,
  HospitalResponse,
  InstitutionResponse,
  DoctorResponse,
} from "../types";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctors = async (
  page = 1,
  size = config.itemsPerPage
): Promise<DoctorResponse> => {
  const response = await apiClient.get<DoctorResponse>(
    `/api/doctors?page=${page}&size=${size}`
  );
  return response.data;
};

export const fetchHospitals = async (
  page = 0, // 0-based page index
  size = config.itemsPerPage,
  districtIds?: number,
  hospitalTypes?: string,
  organizationType?: string
) => {
  let url = `/api/hospitals?page=${page}&size=${size}`;

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
  }>(`/api/hospitals/${hospitalId}/doctors?page=${page}&size=${size}`);
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
