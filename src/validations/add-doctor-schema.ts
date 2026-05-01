import { z } from "zod";

export const addDoctorSchema = z.object({
	// Basic Info
	name: z.string().min(1, "Name is required"),
	bnName: z.string().optional(),
	email: z.string().email("Invalid email address").or(z.literal("")),
	phone: z.string().min(1, "Phone number is required"),
	username: z.string().optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"], {
		message: "Gender is required",
	}),
	dateOfBirth: z.string().optional(),
	address: z.string().optional(),

	// Location
	districtId: z.number().optional(),
	upazilaId: z.number().optional(),
	unionId: z.number().optional(),

	// Medical Info
	bmdcNo: z.string().optional(),
	startDate: z.string().optional(),
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
