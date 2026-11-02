import { apiGet, apiPost } from "@/lib/api-client";

/** Where the signed-in person stands with phone verification; `maskedPhone` shows only the last three digits. */
export interface PhoneVerificationStatus {
	required: boolean;
	verified: boolean;
	maskedPhone: string | null;
	sent: boolean;
}

export const getPhoneVerification = async () => (await apiGet<PhoneVerificationStatus>("/me/phone-verification")).data as PhoneVerificationStatus;

/** Sends a code by text message to the number on the profile. A refusal (no phone, no text provider, too many) is thrown as an ApiError. */
export const sendPhoneCode = async () => (await apiPost<PhoneVerificationStatus>("/me/phone-verification")).data as PhoneVerificationStatus;

export const confirmPhoneCode = async (code: string) => (await apiPost<PhoneVerificationStatus>("/me/phone-verification/confirm", { code })).data as PhoneVerificationStatus;
