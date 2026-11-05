import type { ContributionKind, ContributionStatus } from "@/types/contribution";

export type Track = "GENERAL" | "DOCTOR";

/** The name of a kind's data in the request body. */
export const REQUEST_KEY: Record<ContributionKind, string> = {
	DOCTOR: "doctor",
	NURSE: "nurse",
	HOSPITAL: "hospital",
	AMBULANCE: "ambulance",
	BLOG: "blog",
	HOSPITAL_TEST_REVIEW: "hospitalTestReview",
	MEDICAL_CAMP: "medicalCamp",
	FREE_CONSULTATION: "freeConsultation",
};

export const KIND_WORDS: Record<ContributionKind, { label: string; points: number; hint: string; track: Track }> = {
	DOCTOR: { label: "Doctor", points: 30, hint: "A doctor who is not listed yet. You need their BMDC number.", track: "GENERAL" },
	NURSE: { label: "Nurse", points: 30, hint: "A nurse who is not listed yet. You need their BNMC number.", track: "GENERAL" },
	HOSPITAL: { label: "Hospital or clinic", points: 30, hint: "A hospital, clinic or diagnostic centre that is not listed yet.", track: "GENERAL" },
	AMBULANCE: { label: "Ambulance", points: 20, hint: "An ambulance with its vehicle number and the driver's phone.", track: "GENERAL" },
	BLOG: { label: "Health article", points: 40, hint: "Write a health article. If staff accept it, it is published under your name.", track: "DOCTOR" },
	HOSPITAL_TEST_REVIEW: { label: "Hospital test review", points: 10, hint: "Review one test a hospital offers, and say whether you accept it.", track: "DOCTOR" },
	MEDICAL_CAMP: { label: "Medical camp", points: 50, hint: "Report a medical camp you held: date, place and patients served.", track: "DOCTOR" },
	FREE_CONSULTATION: { label: "Free consultation", points: 20, hint: "Report free consultations you gave: date, place and patients seen.", track: "DOCTOR" },
};

export const STATUS_WORDS: Record<ContributionStatus, string> = {
	PENDING: "Waiting for a decision",
	APPROVED: "Accepted",
	REJECTED: "Not accepted",
	WITHDRAWN: "Withdrawn",
};

/** Turns plain text into safe paragraphs: no HTML is ever typed by the person (the server cleans it again). */
export function textToHtml(text: string): string {
	const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return text
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`)
		.join("");
}
