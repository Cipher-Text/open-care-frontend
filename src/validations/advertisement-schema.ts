import { z } from "zod";

const optionalText = (max: number, label: string) =>
	z.string().max(max, `${label} must be at most ${max} characters`);

export const advertisementTypeSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
	description: z
		.string()
		.trim()
		.min(1, "Description is required")
		.max(255, "Description must be at most 255 characters"),
	position: z.string().min(1, "Choose a position"),
	basePrice: z.number({ message: "Enter a price" }).min(0, "Price cannot be negative"),
	durationInDays: z
		.number({ message: "Enter a number of days" })
		.int("Use a whole number of days")
		.min(1, "At least 1 day")
		.max(3650, "At most 3650 days"),
});
export type AdvertisementTypeFormData = z.infer<typeof advertisementTypeSchema>;

export const advertisementSchema = z
	.object({
		title: z.string().trim().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
		content: optionalText(1000, "Content"),
		imageUrl: optionalText(500, "Image URL").refine(
			(v) => v === "" || /^https?:\/\//i.test(v),
			"Image URL must start with http:// or https://"
		),
		targetUrl: optionalText(500, "Target URL").refine(
			(v) => v === "" || /^(https?:\/\/|\/)/i.test(v),
			"Use a site path like /doctors/1 or a full http(s) URL"
		),
		targetType: z.enum(["doctor", "hospital", "institution"], { message: "Choose a target type" }),
		targetId: z.string().refine((v) => v === "" || /^\d+$/.test(v), "Use a whole number"),
		advTypeId: z.string().min(1, "Choose an advertisement type"),
		districtId: z.string(),
		upazilaId: z.string(),
		medSpecialityId: z.string(),
		ageGroup: z.string(),
		gender: z.string(),
		startTime: z.string().min(1, "Start time is required"),
		endTime: z.string().min(1, "End time is required"),
		isActive: z.boolean(),
	})
	.refine((d) => !d.startTime || !d.endTime || d.endTime > d.startTime, {
		path: ["endTime"],
		message: "End time must be after start time",
	});
export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
