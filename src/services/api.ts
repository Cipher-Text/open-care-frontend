import axios from "axios";
import config from "../config";
import { BlogPost, Doctor, Hospital, Institute, User } from "../types";

const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctors = async (page = 1, limit = config.itemsPerPage) => {
  const response = await apiClient.get<{ data: Doctor[]; total: number }>(
    `/api/doctors?page=${page}&size=${limit}`
  );
  return response.data;
};

export const fetchHospitals = async (page = 1, limit = config.itemsPerPage) => {
  const response = await apiClient.get<{ data: Hospital[]; total: number }>(
    `/hospitals?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const fetchInstitutes = async (
  page = 1,
  limit = config.itemsPerPage
) => {
  const response = await apiClient.get<{ data: Institute[]; total: number }>(
    `/institutes?page=${page}&limit=${limit}`
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
