import type { VerificationSubject } from "@/types/verification";

/** Words for the three kinds of verification request, so the screens do not each repeat a two-way check. */
export const subjectWords: Record<VerificationSubject, { kind: string; profile: string; number: string }> = {
	DOCTOR: { kind: "Doctor", profile: "Doctor profile", number: "BMDC number" },
	NURSE: { kind: "Nurse", profile: "Nurse profile", number: "BNMC number" },
	NUTRITIONIST: { kind: "Nutritionist", profile: "Nutritionist profile", number: "Registration number" },
	HOSPITAL: { kind: "Facility", profile: "Facility", number: "Registration number" },
};

/** The public page of a subject: doctors and hospitals by slug, nurses and nutritionists by id. */
export const publicPathFor = (type: VerificationSubject, slug: string | null | undefined, id?: number | null) => {
	if (type === "NURSE") return id != null ? `/nurses/${id}` : null;
	if (type === "NUTRITIONIST") return id != null ? `/nutritionists/${id}` : null;
	return slug ? (type === "DOCTOR" ? `/doctors/${slug}` : `/hospitals/${slug}`) : null;
};
