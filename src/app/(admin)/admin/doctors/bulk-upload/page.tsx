"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react";
import { uploadDoctorsCsv } from "@/api/doctors";
import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import {
	DoctorBulkImportResponse,
	DoctorBulkImportRow,
	DoctorBulkImportStatus,
} from "@/types/doctors";

const MAX_BYTES = 1_048_576;
const MAX_ROWS = 1000;

const COLUMNS: { name: string; required?: boolean; note: string }[] = [
	{ name: "name", required: true, note: "Full name, up to 100 characters" },
	{ name: "gender", required: true, note: "MALE, FEMALE or OTHER (M, F and O also work)" },
	{ name: "bmdcNo", required: true, note: "BMDC registration number, must be unique" },
	{ name: "bnName", note: "Bengali name" },
	{ name: "phone", note: "10 to 15 digits, optional leading +" },
	{ name: "email", note: "Must be unique" },
	{ name: "username", note: "Letters, numbers, - and _. Generated from the BMDC number if empty" },
	{ name: "dateOfBirth", note: "YYYY-MM-DD" },
	{ name: "bloodGroup", note: "A+, O-, AB+ and so on" },
	{ name: "degrees", note: "For example: MBBS, FCPS" },
	{ name: "specializations", note: "For example: Cardiology" },
	{ name: "startDate", note: "Practice start date, YYYY-MM-DD" },
	{ name: "description", note: "Up to 1000 characters" },
	{ name: "address", note: "Up to 500 characters" },
	{ name: "district", note: "District name, for example Dhaka" },
];

const TEMPLATE =
	COLUMNS.map((c) => c.name).join(",") +
	"\n" +
	[
		'Dr. Aisha Rahman,FEMALE,A-12345,01711111111,aisha@example.com,,,1985-04-12,O+,"MBBS, FCPS",Cardiology,2012-01-01,,,Dhaka',
		"Dr. Karim Hossain,MALE,A-12346,,,,,,,MBBS,General medicine,,,,Chattogram",
	]
		.join("\n") +
	"\n";

const STATUS_STYLE: Record<DoctorBulkImportStatus, { label: string; className: string }> = {
	VALID: { label: "Ready", className: "bg-success/15 text-success" },
	CREATED: { label: "Imported", className: "bg-success/15 text-success" },
	DUPLICATE: { label: "Skipped", className: "bg-warning/15 text-warning" },
	INVALID: { label: "Invalid", className: "bg-destructive/10 text-destructive" },
	FAILED: { label: "Failed", className: "bg-destructive/10 text-destructive" },
};

type Filter = "ALL" | "OK" | "SKIPPED" | "ERRORS";

function matchesFilter(row: DoctorBulkImportRow, filter: Filter) {
	if (filter === "ALL") return true;
	if (filter === "OK") return row.status === "VALID" || row.status === "CREATED";
	if (filter === "SKIPPED") return row.status === "DUPLICATE";
	return row.status === "INVALID" || row.status === "FAILED";
}

function downloadTemplate() {
	const blob = new Blob(["﻿" + TEMPLATE], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "doctors-template.csv";
	a.click();
	URL.revokeObjectURL(url);
}

export default function DoctorBulkUploadPage() {
	const { hasPermission } = usePermissions();
	const canCreate = hasPermission("create-doctor");
	const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);
	const [report, setReport] = useState<DoctorBulkImportResponse | null>(null);
	const [filter, setFilter] = useState<Filter>("ALL");

	const validate = useMutation({
		mutationFn: (f: File) => uploadDoctorsCsv(f, true),
		onSuccess: (data) => {
			setReport(data);
			setFilter(data.errorCount > 0 ? "ERRORS" : "ALL");
		},
	});

	const importNow = useMutation({
		mutationFn: (f: File) => uploadDoctorsCsv(f, false),
		onSuccess: (data) => {
			setReport(data);
			setFilter("ALL");
			queryClient.invalidateQueries({ queryKey: ["doctors"] });
		},
	});

	const busy = validate.isPending || importNow.isPending;
	const imported = report && !report.dryRun;
	const error = (validate.error || importNow.error) as Error | null;

	const onFileChange = (f: File | undefined) => {
		validate.reset();
		importNow.reset();
		setReport(null);
		setFileError(null);
		if (!f) return setFile(null);
		if (!f.name.toLowerCase().endsWith(".csv")) {
			setFile(null);
			return setFileError("Choose a .csv file. In Excel use Save As, CSV UTF-8.");
		}
		if (f.size > MAX_BYTES) {
			setFile(null);
			return setFileError("The file is larger than 1 MB.");
		}
		setFile(f);
	};

	const reset = () => {
		onFileChange(undefined);
		if (inputRef.current) inputRef.current.value = "";
	};

	if (!canCreate) {
		return (
			<div className="flex flex-col">
				<AdminHeader title="Bulk upload doctors" description="" />
				<div className="p-8 text-muted-foreground">
					You need the create-doctor permission to upload doctors.
				</div>
			</div>
		);
	}

	const rows = report?.rows.filter((r) => matchesFilter(r, filter)) ?? [];

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Bulk upload doctors"
				description="Add many doctors at once from a CSV file"
			>
				<Button variant="outline" asChild>
					<Link href="/admin/doctors">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to doctors
					</Link>
				</Button>
			</AdminHeader>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
							1. Prepare your file
						</CardTitle>
						<CardDescription>
							Up to {MAX_ROWS} doctors per file, 1 MB, CSV (UTF-8). Doctors that already
							exist (same BMDC number, email or username) are skipped, never changed.
							Imported doctors are not verified; verify them from the doctors list.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button variant="outline" onClick={downloadTemplate}>
							<Download className="mr-2 h-4 w-4" aria-hidden="true" />
							Download template
						</Button>
						<details className="text-sm">
							<summary className="cursor-pointer font-medium">Columns</summary>
							<ul className="mt-2 grid gap-1 sm:grid-cols-2">
								{COLUMNS.map((c) => (
									<li key={c.name}>
										<code className="font-mono">{c.name}</code>
										{c.required && <span className="text-destructive"> *</span>}
										<span className="text-muted-foreground"> {c.note}</span>
									</li>
								))}
							</ul>
						</details>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Upload className="h-5 w-5" aria-hidden="true" />
							2. Upload and check
						</CardTitle>
						<CardDescription>Nothing is saved until you confirm the import.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<input
								ref={inputRef}
								type="file"
								accept=".csv,text/csv"
								aria-label="Doctors CSV file"
								disabled={busy || !!imported}
								onChange={(e) => onFileChange(e.target.files?.[0])}
								className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-2 file:text-sm"
							/>
							<Button
								disabled={!file || busy || !!imported}
								onClick={() => file && validate.mutate(file)}
							>
								{validate.isPending ? "Checking..." : "Check file"}
							</Button>
						</div>
						{fileError && (
							<p role="alert" className="text-sm text-destructive">
								{fileError}
							</p>
						)}
						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error.message}
							</p>
						)}
					</CardContent>
				</Card>

				{report && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								{imported ? "3. Import finished" : "3. Review and import"}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
								<Stat label="Rows in file" value={report.totalRows} />
								<Stat
									label={imported ? "Imported" : "Ready to import"}
									value={imported ? report.createdCount : report.validRows}
									tone="success"
								/>
								<Stat label="Skipped (already exist)" value={report.skippedCount} tone="warning" />
								<Stat label="Errors" value={report.errorCount} tone="danger" />
							</div>

							<div className="flex flex-wrap gap-2" role="group" aria-label="Filter rows">
								{(
									[
										["ALL", "All"],
										["OK", imported ? "Imported" : "Ready"],
										["SKIPPED", "Skipped"],
										["ERRORS", "Errors"],
									] as [Filter, string][]
								).map(([key, label]) => (
									<Button
										key={key}
										size="sm"
										variant={filter === key ? "default" : "outline"}
										aria-pressed={filter === key}
										onClick={() => setFilter(key)}
									>
										{label}
									</Button>
								))}
							</div>

							<div className="max-h-[28rem] overflow-auto rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-16">Row</TableHead>
											<TableHead className="w-28">Status</TableHead>
											<TableHead>Doctor</TableHead>
											<TableHead>BMDC no.</TableHead>
											<TableHead>Details</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{rows.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center text-muted-foreground">
													No rows in this view.
												</TableCell>
											</TableRow>
										) : (
											rows.map((row) => (
												<TableRow key={row.rowNumber}>
													<TableCell>{row.rowNumber}</TableCell>
													<TableCell>
														<Badge className={STATUS_STYLE[row.status].className} variant="outline">
															{STATUS_STYLE[row.status].label}
														</Badge>
													</TableCell>
													<TableCell>{row.name || "-"}</TableCell>
													<TableCell className="font-mono text-xs">{row.bmdcNo || "-"}</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{row.messages.join("; ")}
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>

							{imported ? (
								<div className="flex flex-wrap items-center gap-3">
									<CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
									<span>
										{report.createdCount} doctor{report.createdCount === 1 ? "" : "s"} imported.
									</span>
									<Button asChild>
										<Link href="/admin/doctors">View doctors</Link>
									</Button>
									<Button variant="outline" onClick={reset}>
										Upload another file
									</Button>
								</div>
							) : (
								<div className="flex flex-wrap items-center gap-3">
									<Button
										disabled={report.validRows === 0 || busy}
										onClick={() => file && importNow.mutate(file)}
									>
										{importNow.isPending
											? "Importing..."
											: `Import ${report.validRows} doctor${report.validRows === 1 ? "" : "s"}`}
									</Button>
									<Button variant="outline" onClick={reset} disabled={busy}>
										Choose another file
									</Button>
									{report.errorCount > 0 && (
										<span className="text-sm text-muted-foreground">
											Rows with errors will not be imported. Fix them in the file and check again, or
											import the valid rows now.
										</span>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

function Stat({
	label,
	value,
	tone,
}: {
	label: string;
	value: number;
	tone?: "success" | "warning" | "danger";
}) {
	const color =
		tone === "success"
			? "text-success"
			: tone === "warning"
			? "text-warning"
			: tone === "danger"
			? "text-destructive"
			: "text-foreground";
	return (
		<div className="rounded-lg border bg-card p-3">
			<div className={`text-2xl font-semibold ${color}`}>{value.toLocaleString()}</div>
			<div className="text-sm text-muted-foreground">{label}</div>
		</div>
	);
}
