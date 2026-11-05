import { z } from "zod";

export const loginSchema = z.object({
	// only "filled in": whether the name and password are right is the server's to say, and a length rule here would lock out
	// someone whose real password is shorter than the one we would choose today
	username: z.string().trim().min(1, "Enter your username or email"),
	password: z.string().min(1, "Enter your password"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
