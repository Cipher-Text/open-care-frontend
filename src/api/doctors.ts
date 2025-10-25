import { baseUrl } from "@/config/config";
import {
  DoctorListResponse,
  Doctor,
  DoctorDetailsResponse,
} from "@/types/doctors";
import { AddDoctorFormData } from "@/validations/add-doctor-schema";

interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}
// Helper function to build query string
const buildQueryString = (params: QueryParams): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

export const fetchDoctors = async (
  params: QueryParams
): Promise<DoctorListResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${baseUrl}/doctors?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch doctors: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const addDoctor = async (
  doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  // Transform the form data to match the API request body format
  // const requestBody = {
  // 	bmdcNo: doctorData.bmdcNo,
  // 	startDate: doctorData.startDate,
  // 	degrees: doctorData.degrees,
  // 	specializations: doctorData.specializations,
  // 	description: doctorData.description || "",
  // 	isActive: doctorData.isActive,
  // 	isVerified: doctorData.isVerified,
  // 	username: doctorData.username,
  // 	photo: doctorData.photo || "",
  // 	phone: doctorData.phone,
  // 	email: doctorData.email,
  // 	name: doctorData.name,
  // 	bnName: doctorData.bnName,
  // 	gender: doctorData.gender,
  // 	dateOfBirth: new Date(doctorData.dateOfBirth).toISOString(),
  // 	address: doctorData.address,
  // 	districtId: doctorData.districtId,
  // 	upazilaId: doctorData.upazilaId,
  // 	unionId: doctorData.unionId,
  // };

  const response = await fetch(`${baseUrl}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to add doctor: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchDoctorById = async (id: string): Promise<Doctor> => {
  const response = await fetch(`${baseUrl}/doctors/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch doctor: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchDoctorDetailsById = async (
  id: number
): Promise<DoctorDetailsResponse> => {
  const response = await fetch(
    `${baseUrl}/doctors/${id}?degrees=true&workplaces=true&associations=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch doctor details: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const updateDoctor = async (
  id: string,
  doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await fetch(`${baseUrl}/doctors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update doctor: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
