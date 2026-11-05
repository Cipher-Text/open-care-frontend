// The rows of a degree list as they are typed, and what is sent from them. No React here, so it can be tested on its own.

/** One degree as it is typed: every field is text until it is saved. `typed` means "my degree is not on the list: I type its name". */
export interface DegreeRow {
	degreeId: string;
	typed: boolean;
	degreeName: string;
	institutionId: string;
	institutionName: string;
	passingYear: string;
	grade: string;
}

export const MAX_DEGREES = 10;

export const emptyDegree = (): DegreeRow => ({ degreeId: "", typed: false, degreeName: "", institutionId: "", institutionName: "", passingYear: "", grade: "" });

/** Whether the row names a degree at all: one chosen from the list, or one typed. */
const hasDegree = (r: DegreeRow) => r.degreeId !== "" || r.degreeName.trim() !== "";

/** A row as the server sent it back (a degree with no list entry was typed). */
export function rowFromSaved(d: { degreeName: string; degreeId?: number | null; institutionId?: number | null; institutionName?: string | null; passingYear?: number | null; grade?: string | null }): DegreeRow {
	return {
		degreeId: d.degreeId ? String(d.degreeId) : "",
		typed: !d.degreeId,
		degreeName: d.degreeName,
		institutionId: d.institutionId ? String(d.institutionId) : "",
		institutionName: d.institutionName ?? "",
		passingYear: d.passingYear ? String(d.passingYear) : "",
		grade: d.grade ?? "",
	};
}

/** The rows to send: rows with no degree are dropped, ids and the year become numbers, and a typed name is sent only when no list entry was chosen. */
export function degreesToRequest(rows: DegreeRow[]) {
	return rows.filter(hasDegree).map((r) => ({
		degreeId: r.degreeId ? Number(r.degreeId) : undefined,
		degreeName: r.degreeId ? undefined : r.degreeName.trim(),
		institutionId: r.institutionId ? Number(r.institutionId) : undefined,
		institutionName: r.institutionName.trim() || undefined,
		passingYear: r.passingYear.trim() ? Number(r.passingYear) : undefined,
		grade: r.grade.trim() || undefined,
	}));
}

/** The first problem with the rows, or null: a row with details needs a degree, and a year is four digits between 1950 and this year. */
export function degreeProblem(rows: DegreeRow[], thisYear = new Date().getFullYear()): string | null {
	for (const r of rows) {
		if (!hasDegree(r) && (r.institutionName.trim() || r.passingYear.trim() || r.grade.trim())) return "Choose or type a degree for each row, or remove the row.";
		const year = r.passingYear.trim();
		if (year && (!/^\d{4}$/.test(year) || Number(year) < 1950 || Number(year) > thisYear)) return `The year of ${r.degreeName.trim() || "a degree"} must be between 1950 and ${thisYear}.`;
	}
	return null;
}
