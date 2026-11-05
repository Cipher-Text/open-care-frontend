import type { PageResult } from "@/types/common";
import type { NurseProfile } from "@/types/nurses";

/** What a nutrition professional is called. One type: the two overlap and the credentials differ by country. */
export type NutritionistTitle = "NUTRITIONIST" | "DIETITIAN";

/** A nutritionist or dietitian: not a physician. The public routes carry the public profile; the administration and own-record routes the complete one. */
export interface NutritionistResponse {
	id: number;
	registrationNo: string | null;
	title: NutritionistTitle;
	degrees: string | null;
	startDate: string | null;
	yearOfExperience: number | null;
	description: string | null;
	isActive: boolean;
	isVerified: boolean;
	profile: NurseProfile;
}

export type NutritionistListResponse = PageResult<NutritionistResponse>;

/** What a nutritionist may change on their own record. */
export interface NutritionistInput {
	name: string;
	bnName?: string;
	gender: string;
	title?: NutritionistTitle;
	registrationNo?: string;
	degrees?: string;
	startDate?: string;
	description?: string;
	phone?: string;
	email?: string;
	address?: string;
	districtId?: number;
	upazilaId?: number;
}
