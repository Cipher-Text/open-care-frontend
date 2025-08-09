import { z } from "zod";

export const addHospitalSchema = z.object({
	// Basic Info
	name: z.string().min(1, "Hospital name is required"),
	bnName: z.string().min(1, "Bengali name is required"),
	numberOfBed: z.number().min(1, "Number of beds must be at least 1"),

	// Location
	districtId: z.number().min(1, "District is required"),
	upazilaId: z.number().min(1, "Upazila is required"),
	unionId: z.number().min(1, "Union is required"),
	lat: z.string().optional(),
	lon: z.string().optional(),

	// Hospital Details
	hospitalType: z.string().min(1, "Hospital type is required"),
	organizationType: z.string().min(1, "Organization type is required"),
	websiteUrl: z
		.string()
		.url("Invalid website URL")
		.optional()
		.or(z.literal("")),
});

export type AddHospitalFormData = z.infer<typeof addHospitalSchema>;
