import { z } from "zod";

export const addInstitutionSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Institution name is required"),
  bnName: z.string().min(1, "Bengali name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),

  // Institution Details
  establishedYear: z
    .number()
    .min(1800, "Invalid establishment year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  enroll: z.number().min(0, "Enrollment must be a positive number"),
  websiteUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Invalid website URL"
    ),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Invalid image URL"
    ),

  // Location
  districtId: z.number().min(1, "District is required"),
  upazilaId: z.number().min(1, "Upazila is required"),
  lat: z.number().optional(),
  lon: z.number().optional(),

  // Types
  institutionTypeValue: z.string().min(1, "Institution type is required"),
  organizationTypeValue: z.string().min(1, "Organization type is required"),
  countryValue: z.string().min(1, "Country is required"),

  // Affiliated Hospital (Optional)
  affiliatedHospitalId: z.number().optional(),

  // Status
  affiliated: z.boolean(),

  // Optional fields
  description: z.string().optional(),
  locationWkt: z.string().optional(),
});

export type AddInstitutionFormData = z.infer<typeof addInstitutionSchema>;
