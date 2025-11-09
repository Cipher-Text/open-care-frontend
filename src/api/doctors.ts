"use client";

import {
  DoctorListResponse,
  Doctor,
  DoctorDetailsResponse,
} from "@/types/doctors";
import { AddDoctorFormData } from "@/validations/add-doctor-schema";
import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";

export const fetchDoctors = async (
  params: Record<string, unknown> = {}
): Promise<DoctorListResponse> => {
  const url = buildUrl("/doctors", params);
  const response = await apiGet<DoctorListResponse>(url);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch doctors");
  }

  return response.data as DoctorListResponse;
};

export const addDoctor = async (
  doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await apiPost("/doctors", doctorData);

  if (!response.ok) {
    throw new Error(response.error || "Failed to add doctor");
  }

  return response.data as {
    success: boolean;
    message?: string;
    data?: unknown;
  };
};

export const fetchDoctorById = async (id: string): Promise<Doctor> => {
  const response = await apiGet<Doctor>(`/doctors/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch doctor");
  }

  return response.data as Doctor;
};

export const fetchDoctorDetailsById = async (
  id: number
): Promise<DoctorDetailsResponse> => {
  const url = buildUrl(`/doctors/${id}`, {
    degrees: true,
    workplaces: true,
    associations: true,
  });
  const response = await apiGet<DoctorDetailsResponse>(url);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch doctor details");
  }

  return response.data as DoctorDetailsResponse;
};

export const updateDoctor = async (
  id: string,
  doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await apiPut(`/doctors/${id}`, doctorData);

  if (!response.ok) {
    throw new Error(response.error || "Failed to update doctor");
  }

  return response.data as {
    success: boolean;
    message?: string;
    data?: unknown;
  };
};

// Doctor Degree APIs
export interface AddDoctorDegreeData {
  doctorId: number;
  degreeId: number;
  medicalSpecialityId: number;
  institutionId: number;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  endDateValid: boolean;
}

export interface DoctorDegreeResponse {
  id: number;
  doctor: {
    id: number;
    isActive: boolean;
    isVerified: boolean;
    tags: string[];
  };
  degree: {
    id: number;
    name: string | null;
    abbreviation: string | null;
    degreeType: {
      value: string | null;
      displayName: string | null;
      banglaName: string;
    } | null;
  };
  medicalSpeciality: {
    id: number;
    parentId: number | null;
    name: string | null;
    bnName: string | null;
    icon: string | null;
    imageUrl: string | null;
    description: string | null;
    doctorCount: number;
  };
  institution: {
    id: number;
    acronym: string | null;
    name: string | null;
    bnName: string | null;
    imageUrl: string | null;
    establishedYear: number | null;
    enroll: number | null;
    district: unknown | null;
    upazila: unknown | null;
    affiliatedHospital: unknown | null;
    country: unknown | null;
    institutionType: unknown | null;
    organizationType: unknown | null;
    lat: string | null;
    lon: string | null;
    websiteUrl: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    affiliated: boolean;
    tags: string[];
    locationWkt: string | null;
  };
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const addDoctorDegree = async (
  degreeData: AddDoctorDegreeData
): Promise<DoctorDegreeResponse> => {
  const response = await apiPost(
    `/doctors/${degreeData.doctorId}/degrees`,
    degreeData
  );

  if (!response.ok) {
    throw new Error(response.error || "Failed to add doctor degree");
  }

  return response.data as DoctorDegreeResponse;
};

export const updateDoctorDegree = async (
  doctorId: number,
  degreeId: number,
  degreeData: Partial<AddDoctorDegreeData>
): Promise<DoctorDegreeResponse> => {
  const response = await apiPut(
    `/doctors/${doctorId}/degrees/${degreeId}`,
    degreeData
  );

  if (!response.ok) {
    throw new Error(response.error || "Failed to update doctor degree");
  }

  return response.data as DoctorDegreeResponse;
};

export const deleteDoctorDegree = async (
  doctorId: number,
  degreeId: number
): Promise<void> => {
  const response = await apiPost(
    `/doctors/${doctorId}/degrees/${degreeId}`,
    {}
  );

  if (!response.ok) {
    throw new Error(response.error || "Failed to delete doctor degree");
  }
};
