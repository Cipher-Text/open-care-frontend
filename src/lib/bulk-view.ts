import type { BulkColumn, BulkResponse, BulkRow, BulkRowResult } from "@/api/bulk-upload";

/** The text of a CSV template: the column keys, then one example row. Cells with commas, quotes or line breaks are quoted. */
export function templateCsv(columns: BulkColumn[]): string {
	const cell = (text: string) => (/[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text);
	return `${columns.map((c) => cell(c.key)).join(",")}\n${columns.map((c) => cell(c.example)).join(",")}\n`;
}

/** The preview's rows as the server wants them back: only filled cells, trimmed. */
export function toRows(results: { rowNumber: number; values: Record<string, string> }[]): BulkRow[] {
	return results.map((r) => ({
		rowNumber: r.rowNumber,
		values: Object.fromEntries(Object.entries(r.values).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v !== "")),
	}));
}

/** What the person is told above the preview. */
export function summaryLine(r: BulkResponse): string {
	const parts: string[] = [];
	if (r.toCreate) parts.push(`${r.toCreate} to add`);
	if (r.toUpdate) parts.push(`${r.toUpdate} to change`);
	if (r.unchanged) parts.push(`${r.unchanged} with nothing to change`);
	if (r.withProblems) parts.push(`${r.withProblems} with a problem`);
	return parts.length ? parts.join(", ") : "No rows";
}

/** Saving is offered only for rows that were checked and are all fine, and at least one of them does something. */
export function canSave(r: BulkResponse | null, edited: boolean): boolean {
	return !!r && !edited && r.withProblems === 0 && r.toCreate + r.toUpdate > 0;
}

/** Row styling: problems red, duplicates amber, the rest plain. */
export function rowTone(row: BulkRowResult): "bad" | "warn" | "ok" {
	return row.status === "INVALID" ? "bad" : row.status === "DUPLICATE" ? "warn" : "ok";
}
