import type { VerificationSubject } from "@/types/verification";

/** Words for the three kinds of verification request, so the screens do not each repeat a two-way check. */
export const subjectWords: Record<VerificationSubject, { kind: string; profile: string; number: string }> = {
	DOCTOR: { kind: "Doctor", profile: "Doctor profile", number: "BMDC number" },
	NURSE: { kind: "Nurse", profile: "Nurse profile", number: "BNMC number" },
	HOSPITAL: { kind: "Facility", profile: "Facility", number: "Registration number" },
};

export const publicPathFor = (type: VerificationSubject, slug: string | null | undefined) =>
	slug ? (type === "DOCTOR" ? `/doctors/${slug}` : type === "HOSPITAL" ? `/hospitals/${slug}` : null) : null;
