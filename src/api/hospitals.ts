import { baseUrl } from "@/config/config";
import { ICommonEnum } from "@/types/common";
import {
  HospitalListResponse,
  Hospital,
  HospitalDetailsResponse,
} from "@/types/hospitals";
import { AddHospitalFormData } from "@/validations/add-hospital-schema";

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

export const fetchHospitals = async (
  params: QueryParams
): Promise<HospitalListResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${baseUrl}/hospitals?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch hospitals: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const addHospital = async (
  hospitalData: AddHospitalFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await fetch(`${baseUrl}/hospitals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hospitalData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to add hospital: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchHospitalById = async (id: string): Promise<Hospital> => {
  const response = await fetch(`${baseUrl}/hospitals/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch hospital: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchHospitalDetailsById = async (
  id: number
): Promise<HospitalDetailsResponse> => {
  const response = await fetch(
    `${baseUrl}/hospitals/${id}?doctors=true&tests=true&amenities=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch hospital details: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const updateHospital = async (
  id: string,
  hospitalData: AddHospitalFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await fetch(`${baseUrl}/hospitals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hospitalData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update hospital: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchHospitalTypes = async (): Promise<ICommonEnum[]> => {
  const response = await fetch(`${baseUrl}/hospital-types`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch hospital types: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchOrganizationTypes = async (): Promise<ICommonEnum[]> => {
  const response = await fetch(`${baseUrl}/organization-types`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch organization types: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
