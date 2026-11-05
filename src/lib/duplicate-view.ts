import type { DuplicateKind, DuplicateReason } from "@/api/duplicates";

/** What each reason means to the person reading the list. `strong` ones are the ones to stop and look at. */
export const REASON_LABEL: Record<DuplicateReason, { label: string; strong: boolean }> = {
	SAME_KEY: { label: "Same registration number", strong: true },
	SAME_NAME_SAME_PLACE: { label: "Same name, same place", strong: true },
	SAME_NAME: { label: "Same name", strong: false },
	SAME_DIGITS: { label: "Same digits in the number", strong: false },
	SIMILAR_NAME: { label: "Similar name", strong: false },
};

/** The staff page of a record, or the list it appears in when it has no page of its own (nurses). */
export function recordHref(type: DuplicateKind, id: number): string {
	switch (type) {
		case "HOSPITAL":
			return `/admin/hospitals/${id}/view`;
		case "DOCTOR":
			return `/admin/doctors/${id}/view`;
		case "AMBULANCE":
			return `/admin/ambulances/${id}/view`;
		default:
			return "/admin/nurses";
	}
}

/** A check is only worth sending with a name of 3 letters or more (the server needs it), or a registration number of 3 characters or more. */
export function canCheck(name: string | undefined, number: string | undefined): boolean {
	return (name ?? "").trim().length >= 3 || (number ?? "").trim().length >= 3;
}

/** Strong matches first, then by closeness; the list the form shows is short, so the order matters. */
export function sortCandidates<T extends { reason: DuplicateReason; score: number }>(list: T[]): T[] {
	return [...list].sort((a, b) => Number(REASON_LABEL[b.reason].strong) - Number(REASON_LABEL[a.reason].strong) || b.score - a.score);
}

/** Whether a form should stop and ask: any strong match. */
export const hasStrongMatch = (list: { reason: DuplicateReason }[]) => list.some((c) => REASON_LABEL[c.reason].strong);
