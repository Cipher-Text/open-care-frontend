import axios, { AxiosError, AxiosInstance } from "axios";
import config from "../config";
import {
	BlogPost,
	Doctor,
	User,
	HospitalResponse,
	InstitutionResponse,
	DoctorResponse,
	Hospital,
	HospitalMedicalTestResponse,
	Degree,
	MedicalSpeciality,
	FeaturedData,
	Institution,
} from "../types";

// Create a custom error class for API errors
export class ApiError extends Error {
	constructor(
		public status: number,
		public message: string,
		public data?: unknown
	) {
		super(message);
		this.name = "ApiError";
	}
}

// Create API client with better configuration
export const createApiClient = (): AxiosInstance => {
	const client = axios.create({
		baseURL: config.apiUrl,
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 10000, // 10 seconds timeout
	});

	// Request interceptor
	client.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// Response interceptor
	client.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response) {
				const errorMessage =
					typeof error.response.data === "object" &&
					error.response.data !== null
						? String(
								(error.response.data as Record<string, unknown>).message ||
									"An error occurred"
						  )
						: "An error occurred";

				throw new ApiError(
					error.response.status,
					errorMessage,
					error.response.data
				);
			}
			throw new ApiError(0, "Network error occurred");
		}
	);

	return client;
};

export const apiClient = createApiClient();

// Type for query parameters
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
	page = 0,
	size = config.itemsPerPage,
	filters: QueryParams = {}
): Promise<DoctorResponse> => {
	try {
		const queryString = buildQueryString({
			page,
			size,
			...filters,
		});

		const response = await apiClient.get<DoctorResponse>(
			`/api/doctors?${queryString}`
		);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch doctors");
	}
};

export const fetchDoctorById = async (id: string | number): Promise<Doctor> => {
	try {
		const response = await apiClient.get<Doctor>(`/api/doctors/${id}`);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch doctor details");
	}
};

export const fetchHospitals = async (
	page = 0,
	size = config.itemsPerPage,
	filters: {
		districtIds?: number;
		hospitalTypes?: string;
		organizationType?: string;
		name?: string;
	} = {}
): Promise<HospitalResponse> => {
	try {
		const queryString = buildQueryString({
			page,
			size,
			...filters,
		});

		const response = await apiClient.get<HospitalResponse>(
			`/api/hospitals?${queryString}`
		);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch hospitals");
	}
};

export const fetchDegrees = async (): Promise<Degree[]> => {
	try {
		const response = await apiClient.get<Degree[]>("/api/degrees");
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch degrees");
	}
};

export const fetchMedicalSpecialities = async (): Promise<
	MedicalSpeciality[]
> => {
	try {
		const response = await apiClient.get<MedicalSpeciality[]>(
			"/api/medical-specialities"
		);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch medical specialities");
	}
};

export const fetchHospitalById = async (id: number): Promise<Hospital> => {
	try {
		const response = await apiClient.get<Hospital>(`/api/hospitals/${id}`);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch hospital details");
	}
};

export const fetchDoctorsByHospital = async (
	hospitalId: number,
	page = 0,
	size = config.itemsPerPage
): Promise<{ doctors: Doctor[]; totalItems: number }> => {
	try {
		const queryString = buildQueryString({
			hospitalId,
			page,
			size,
		});

		const response = await apiClient.get<{
			doctors: Doctor[];
			totalItems: number;
		}>(`/api/doctors?${queryString}`);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch hospital doctors");
	}
};

export const fetchHospitalMedicalTests = async (
	hospitalId: number,
	page = 0,
	size = config.itemsPerPage
): Promise<HospitalMedicalTestResponse> => {
	try {
		const queryString = buildQueryString({
			hospitalId,
			page,
			size,
		});

		const response = await apiClient.get<HospitalMedicalTestResponse>(
			`/api/hospital-medical-tests?${queryString}`
		);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch hospital medical tests");
	}
};

// Institute API calls
export const fetchInstitutions = async (
	page = 0,
	size = config.itemsPerPage,
	filters: QueryParams = {}
): Promise<InstitutionResponse> => {
	try {
		const params = {
			page,
			size,
			...filters,
		};
		const query = buildQueryString(params);
		const response = await apiClient.get<InstitutionResponse>(
			`api/institutions?${query}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching institutes:", error);
		// Default empty response
		return {
			institutions: [],
			currentPage: 0,
			totalPages: 0,
			totalItems: 0,
		};
	}
};

export const fetchInstituteById = async (id: number): Promise<Institution> => {
	try {
		const response = await apiClient.get<Institution>(`/institutions/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching institute ${id}:`, error);
		throw error;
	}
};

export const fetchDoctorsByInstitute = async (
	instituteId: number,
	page = 0,
	size = config.itemsPerPage,
	isTeacher: boolean = false
): Promise<DoctorResponse> => {
	try {
		const params = {
			page,
			size,
			instituteId,
			isTeacher,
		};
		const query = buildQueryString(params);
		const response = await apiClient.get<DoctorResponse>(`/doctors?${query}`);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching doctors for institute ${instituteId}:`,
			error
		);
		// Default empty response
		return {
			doctors: [],
			currentPage: 0,
			totalPages: 0,
			totalItems: 0,
		};
	}
};

export const fetchUserProfile = async (): Promise<User> => {
	try {
		const response = await apiClient.get<User>("/api/user/profile");
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch user profile");
	}
};

export const fetchFeaturedData = async (): Promise<FeaturedData> => {
	try {
		const response = await apiClient.get<FeaturedData>("/featured");
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch featured data");
	}
};

export const fetchLatestBlogs = async (): Promise<{
	data: BlogPost[];
	total: number;
}> => {
	try {
		const response = await apiClient.get<{ data: BlogPost[]; total: number }>(
			"/blogs"
		);
		return response.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Failed to fetch latest blogs");
	}
};
