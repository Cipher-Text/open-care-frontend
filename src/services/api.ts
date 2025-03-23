import axios from "axios";
import config from "../config";
import { BlogPost, Doctor, Institute, User } from "../types";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctors = async (page = 1, size = config.itemsPerPage) => {
  const response = await apiClient.get<{ data: Doctor[]; total: number }>(
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

  const response = await apiClient.get<{
    hospitals: Hospital[];
    totalElements: number;
  }>(url);
  return response.data;
};

export const fetchInstitutes = async (
  page = 1,
  limit = config.itemsPerPage
) => {
  const response = await apiClient.get<{ data: Institute[]; total: number }>(
    `/api/institutes?page=${page}&size=${limit}`
  );
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
