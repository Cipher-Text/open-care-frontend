import { apiGet, apiPost, unwrap } from "@/lib/api-client";

export type BulkKind = "HOSPITAL" | "AMBULANCE" | "HOSPITAL_TEST";

export interface BulkColumn {
	key: string;
	label: string;
	required: boolean;
	help: string;
	example: string;
}

export interface BulkKindInfo {
	kind: BulkKind;
	label: string;
	columns: BulkColumn[];
}

export interface BulkConfig {
	maxRows: number;
	kinds: BulkKindInfo[];
}

/** A row as the preview holds it: values by column key. */
export interface BulkRow {
	rowNumber: number | null;
	values: Record<string, string>;
}

export interface BulkChange {
	field: string;
	from: string;
	to: string;
}

export interface BulkCandidate {
	id: number;
	name: string | null;
	place: string | null;
	reason: string;
}

export interface BulkRowResult {
	rowNumber: number;
	values: Record<string, string>;
	action: "CREATE" | "UPDATE" | "NONE";
	status: "OK" | "DUPLICATE" | "INVALID";
	problems: string[];
	candidates: BulkCandidate[];
	changes: BulkChange[];
	matchedId: number | null;
}

export interface BulkResponse {
	kind: BulkKind;
	saved: boolean;
	maxRows: number;
	toCreate: number;
	toUpdate: number;
	unchanged: number;
	withProblems: number;
	rows: BulkRowResult[];
}

export const fetchBulkConfig = async () => unwrap<BulkConfig>(await apiGet("/admin/bulk/config"), "Could not load the bulk upload settings");

/** Reads the CSV text into rows. Nothing is checked or saved yet. */
export const parseBulkCsv = async (kind: BulkKind, csv: string) =>
	unwrap<{ rows: BulkRow[]; maxRows: number }>(await apiPost(`/admin/bulk/${kind}/parse`, { csv }), "Could not read the file");

/** What each row would do; nothing is saved. */
export const checkBulkRows = async (kind: BulkKind, rows: BulkRow[]) => unwrap<BulkResponse>(await apiPost(`/admin/bulk/${kind}/check`, { rows }), "Could not check the rows");

/** Saves every row or none (saved is false and the rows carry their problems). */
export const commitBulkRows = async (kind: BulkKind, rows: BulkRow[]) => unwrap<BulkResponse>(await apiPost(`/admin/bulk/${kind}/commit`, { rows }), "Could not save the rows");
