/**
 * Pure helpers for the health readings screen, kept free of React so they can be tested.
 *
 * A correction is saved by the server as a NEW reading that replaces the old one (the old one stays in the history), so
 * the id of a reading changes when it is changed, and a reading shown on screen may already have been replaced or deleted
 * (in another tab, or before the list refreshed). A change keeps the values left blank: it cannot remove one.
 */

/** The form's text boxes, as typed. */
export interface ReadingFormValues {
	recordedAt: string;
	systolic: string;
	diastolic: string;
	heartRate: string;
	glucose: string;
	glucoseType: string;
	weight: string;
	height: string;
	temperature: string;
	oxygen: string;
	symptoms: string;
	notes: string;
}

/** What a stored reading holds of the form's fields. */
export interface StoredReadingValues {
	bloodPressureSystolic?: number | null;
	bloodPressureDiastolic?: number | null;
	heartRate?: number | null;
	bloodGlucoseMgDl?: number | null;
	weightKg?: number | null;
	heightCm?: number | null;
	temperatureCelsius?: number | null;
	oxygenSaturation?: number | null;
	symptoms?: string | null;
	notes?: string | null;
}

const CHECKS: { label: string; stored: (r: StoredReadingValues) => unknown; typed: (f: ReadingFormValues) => string }[] = [
	{ label: "blood pressure (upper)", stored: (r) => r.bloodPressureSystolic, typed: (f) => f.systolic },
	{ label: "blood pressure (lower)", stored: (r) => r.bloodPressureDiastolic, typed: (f) => f.diastolic },
	{ label: "pulse", stored: (r) => r.heartRate, typed: (f) => f.heartRate },
	{ label: "oxygen", stored: (r) => r.oxygenSaturation, typed: (f) => f.oxygen },
	{ label: "blood sugar", stored: (r) => r.bloodGlucoseMgDl, typed: (f) => f.glucose },
	{ label: "temperature", stored: (r) => r.temperatureCelsius, typed: (f) => f.temperature },
	{ label: "weight", stored: (r) => r.weightKg, typed: (f) => f.weight },
	{ label: "height", stored: (r) => r.heightCm, typed: (f) => f.height },
	{ label: "symptoms", stored: (r) => r.symptoms, typed: (f) => f.symptoms },
	{ label: "notes", stored: (r) => r.notes, typed: (f) => f.notes },
];

/** The fields that had a value and were emptied in the form. A change cannot remove them, so the screen says so. */
export function clearedFields(original: StoredReadingValues, form: ReadingFormValues): string[] {
	return CHECKS.filter((c) => {
		const had = c.stored(original);
		return had !== null && had !== undefined && String(had).trim() !== "" && c.typed(form).trim() === "";
	}).map((c) => c.label);
}

/** True when the server says this reading no longer exists as it was: not found, or already deleted or replaced. */
export function readingGone(error: unknown): boolean {
	if (typeof error !== "object" || error === null) return false;
	const { status, message } = error as { status?: unknown; message?: unknown };
	if (status === 404) return true;
	return status === 422 && typeof message === "string" && /already deleted or replaced/i.test(message);
}
