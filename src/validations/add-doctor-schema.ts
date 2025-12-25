import { z } from "zod";

export const addDoctorSchema = z.object({
	// Basic Info
	name: z.string().min(1, "Name is required"),
	bnName: z.string().min(1, "Bengali name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	username: z.string().min(1, "Username is required"),
	gender: z.enum(["MALE", "FEMALE", "OTHER"], {
		message: "Gender is required",
	}),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
	address: z.string().min(1, "Address is required"),

	// Location
	districtId: z.number().min(1, "District is required"),
	upazilaId: z.number().min(1, "Upazila is required"),
	unionId: z.number().min(1, "Union is required"),

	// Medical Info
	bmdcNo: z.string().min(1, "BMDC number is required"),
	startDate: z.string().min(1, "Start date is required"),
	description: z.string().optional(),
	bloodGroup: z.string().optional(),
	facebookProfileUrl: z.string().optional(),
	linkedinProfileUrl: z.string().optional(),
	researchGateProfileUrl: z.string().optional(),

	// Optional
	photo: z.string().optional(),
	isActive: z.boolean(),
	isVerified: z.boolean(),
});

export type AddDoctorFormData = z.infer<typeof addDoctorSchema>;
