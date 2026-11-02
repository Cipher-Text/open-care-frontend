/** Rules of the "written by mistake" form; the backend checks the same range again. */
export const VOID_REASON_MIN = 5;
export const VOID_REASON_MAX = 500;

/** Null when the reason is acceptable, else what is wrong in plain words. */
export function voidReasonError(reason: string): string | null {
	const length = reason.trim().length;
	if (length < VOID_REASON_MIN) return `Say why, in at least ${VOID_REASON_MIN} characters, for example that it was for the wrong patient.`;
	if (length > VOID_REASON_MAX) return `The reason can be at most ${VOID_REASON_MAX} characters.`;
	return null;
}
