import { z } from "zod";

export const addHospitalSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Hospital name is required"),
  bnName: z.string().min(1, "Bengali name is required"),
  numberOfBed: z.coerce.number().min(0, "Number of beds must be at least 0"),

  // Location
  districtId: z.coerce.number().min(1, "District is required"),
  upazilaId: z.coerce.number().min(1, "Upazila is required"),
  unionId: z.coerce.number().min(1, "Union is required"),
  lat: z.coerce
    .number()
    .min(-90)
    .max(90)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  lon: z.coerce
    .number()
    .min(-180)
    .max(180)
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // Hospital Details
  hospitalType: z.string().min(1, "Hospital type is required"),
  organizationType: z.string().min(1, "Organization type is required"),
  websiteUrl: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  registrationCode: z.string().optional().or(z.literal("")),
  slug: z.string().optional().or(z.literal("")),
  facebookPageUrl: z.string().optional().or(z.literal("")),
  twitterProfileUrl: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  hasEmergencyService: z.boolean().optional(),
  hasAmbulanceService: z.boolean().optional(),
  hasBloodBank: z.boolean().optional(),
  isAffiliated: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AddHospitalFormInput = z.input<typeof addHospitalSchema>;
export type AddHospitalFormData = z.output<typeof addHospitalSchema>;
