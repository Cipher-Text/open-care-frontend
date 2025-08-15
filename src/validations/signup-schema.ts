import { z } from "zod";

export const signupSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	firstName: z
		.string()
		.min(1, "First name is required")
		.min(2, "First name must be at least 2 characters"),
	lastName: z
		.string()
		.min(1, "Last name is required")
		.min(2, "Last name must be at least 2 characters"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(
			/^(\+880|880|0)?[1-9]\d{8,10}$/,
			"Please enter a valid phone number"
		),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	bloodGroup: z.string().min(1, "Blood group is required"),
	gender: z.string().min(1, "Gender is required"),
	districtId: z.number().min(1, "District is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
