// The rows of a degree list as they are typed, and what is sent from them. No React here, so it can be tested on its own.

/** One degree as it is typed: every field is text until it is saved. */
export interface DegreeRow {
	degreeName: string;
	institutionName: string;
	passingYear: string;
	grade: string;
}

export const MAX_DEGREES = 10;

export const emptyDegree = (): DegreeRow => ({ degreeName: "", institutionName: "", passingYear: "", grade: "" });

/** The rows to send: blank rows are dropped and the year becomes a number. */
export function degreesToRequest(rows: DegreeRow[]) {
	return rows
		.filter((r) => r.degreeName.trim() !== "")
		.map((r) => ({
			degreeName: r.degreeName.trim(),
			institutionName: r.institutionName.trim() || undefined,
			passingYear: r.passingYear.trim() ? Number(r.passingYear) : undefined,
			grade: r.grade.trim() || undefined,
		}));
}

/** The first problem with the rows, or null: a year must be a whole number between 1950 and this year. */
export function degreeProblem(rows: DegreeRow[], thisYear = new Date().getFullYear()): string | null {
	for (const r of rows) {
		if (r.degreeName.trim() === "" && (r.institutionName.trim() || r.passingYear.trim() || r.grade.trim())) return "Give each degree a name, or remove the row.";
		const year = r.passingYear.trim();
		if (year && (!/^\d{4}$/.test(year) || Number(year) < 1950 || Number(year) > thisYear)) return `The year of ${r.degreeName.trim() || "a degree"} must be between 1950 and ${thisYear}.`;
	}
	return null;
}

