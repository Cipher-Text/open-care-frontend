"use client";

import { useRef, useState } from "react";
import { qk } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkBulkRows, commitBulkRows, fetchBulkConfig, parseBulkCsv, type BulkKind, type BulkResponse, type BulkRowResult } from "@/api/bulk-upload";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { canSave, rowTone, summaryLine, templateCsv, toRows } from "@/lib/bulk-view";

interface PreviewRow {
	rowNumber: number;
	values: Record<string, string>;
}

const ACTION_LABEL = { CREATE: "Add", UPDATE: "Change", NONE: "No change" } as const;

/**
 * Add or change many hospitals, ambulances or test prices from a CSV, for Open Care staff. The file is read into a preview that
 * can be edited cell by cell and pruned row by row; "Check" says what each row would do; "Save" writes all of them or none. At most
 * the limit the server reports (50 unless it was set differently) rows at a time.
 */
export default function BulkUploadPage() {
	const queryClient = useQueryClient();
	const config = useQuery({ queryKey: [...qk.bulkConfig], queryFn: fetchBulkConfig, staleTime: 300_000, retry: false });
	const [kind, setKind] = useState<BulkKind>("HOSPITAL");
	const [pasted, setPasted] = useState("");
	const [rows, setRows] = useState<PreviewRow[] | null>(null);
	const [checked, setChecked] = useState<BulkResponse | null>(null);
	const [edited, setEdited] = useState(false);
	const [saved, setSaved] = useState<BulkResponse | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

	const info = config.data?.kinds.find((k) => k.kind === kind);
	const columns = info?.columns ?? [];
	const resultByRow = new Map((checked?.rows ?? []).map((r) => [r.rowNumber, r] as const));

	const reset = () => {
		setRows(null);
		setChecked(null);
		setEdited(false);
		setSaved(null);
		setPasted("");
		if (fileInput.current) fileInput.current.value = "";
	};

	const check = useMutation({
		mutationFn: (rowsToCheck: PreviewRow[]) => checkBulkRows(kind, toRows(rowsToCheck)),
		onSuccess: (response) => {
			setChecked(response);
			setEdited(false);
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not check the rows"),
	});
	const read = useMutation({
		mutationFn: (csv: string) => parseBulkCsv(kind, csv),
		onSuccess: (parsed) => {
			const next = parsed.rows.map((r, i) => ({ rowNumber: r.rowNumber ?? i + 1, values: { ...r.values } }));
			setRows(next);
			setSaved(null);
			check.mutate(next);
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not read the file"),
	});
	const save = useMutation({
		mutationFn: (rowsToSave: PreviewRow[]) => commitBulkRows(kind, toRows(rowsToSave)),
		onSuccess: (response) => {
			if (response.saved) {
				setSaved(response);
				setRows(null);
				setChecked(null);
				toast.success(summaryLine(response));
				void queryClient.invalidateQueries({ queryKey: [...qk.hospitals] });
			} else {
				// something changed since the check, or a row failed: show the rows again with their problems
				setChecked(response);
				setEdited(false);
				toast.error("Nothing was saved: some rows have a problem");
			}
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
	});

	const loadFile = async (file: File | undefined) => {
		if (!file) return;
		read.mutate(await file.text());
	};

	const edit = (rowNumber: number, key: string, value: string) => {
		setRows((current) => (current ?? []).map((r) => (r.rowNumber === rowNumber ? { ...r, values: { ...r.values, [key]: value } } : r)));
		setEdited(true);
	};
	const remove = (rowNumber: number) => {
		const next = (rows ?? []).filter((r) => r.rowNumber !== rowNumber);
		setRows(next);
		setChecked((c) => (c ? { ...c, rows: c.rows.filter((r) => r.rowNumber !== rowNumber) } : c));
		setEdited(true);
	};
	const download = () => {
		const url = URL.createObjectURL(new Blob([templateCsv(columns)], { type: "text/csv;charset=utf-8" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = `${kind.toLowerCase()}-template.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const busy = check.isPending || read.isPending || save.isPending;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Bulk upload" description="Add or change many records from a file, with a preview" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<Alert>
					<AlertDescription>
						For Open Care staff. At most {config.data?.maxRows ?? 50} rows at a time. The file is read into a preview: edit any cell, remove a row, then Check and Save. Saving writes every row or none. A row with an ID changes that record and only the columns you fill; a row without one adds a new record.
					</AlertDescription>
				</Alert>

				{config.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{config.error instanceof Error ? config.error.message : "Could not load the bulk upload settings"}</AlertDescription>
					</Alert>
				) : config.isLoading ? (
					<Skeleton className="h-24 w-full" />
				) : (
					<Card>
						<CardContent className="space-y-4 pt-6">
							<div className="flex flex-wrap items-end gap-3">
								<div className="w-full sm:w-64">
									<label className="text-sm font-medium" htmlFor="bulk-kind">What to upload</label>
									<NativeSelect id="bulk-kind" value={kind} disabled={rows !== null} onChange={(e) => { setKind(e.target.value as BulkKind); setSaved(null); }}>
										{(config.data?.kinds ?? []).map((k) => (
											<option key={k.kind} value={k.kind}>{k.label}</option>
										))}
									</NativeSelect>
								</div>
								<Button type="button" variant="outline" onClick={download}>Download the template</Button>
								{rows !== null && <Button type="button" variant="ghost" onClick={reset}>Start again</Button>}
							</div>

							<details className="text-sm">
								<summary className="cursor-pointer font-medium">Columns</summary>
								<ul className="mt-2 space-y-1">
									{columns.map((c) => (
										<li key={c.key}>
											<span className="font-mono">{c.key}</span>{c.required ? " (needed for a new record)" : ""}: {c.label}. {c.help}
										</li>
									))}
								</ul>
							</details>

							{rows === null && (
								<div className="space-y-3">
									<div>
										<label className="text-sm font-medium" htmlFor="bulk-file">CSV file</label>
										<Input id="bulk-file" ref={fileInput} type="file" accept=".csv,text/csv,text/plain" disabled={busy} onChange={(e) => void loadFile(e.target.files?.[0])} />
									</div>
									<div>
										<label className="text-sm font-medium" htmlFor="bulk-paste">Or paste the rows (first line: the column names)</label>
										<Textarea id="bulk-paste" rows={5} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder={templateCsv(columns.slice(0, 4))} />
										<Button type="button" className="mt-2" disabled={busy || pasted.trim() === ""} onClick={() => read.mutate(pasted)}>Read the rows</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{saved && (
					<Alert>
						<AlertDescription>Saved: {summaryLine(saved)}. Upload another file whenever you are ready.</AlertDescription>
					</Alert>
				)}

				{rows !== null && (
					<Card>
						<CardContent className="space-y-4 pt-6">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<p className="text-sm">
									<span className="font-medium">{rows.length} rows.</span>{" "}
									{edited ? "You changed the preview: check it again." : checked ? summaryLine(checked) : "Checking..."}
								</p>
								<div className="flex gap-2">
									<Button type="button" variant="outline" disabled={busy || rows.length === 0} onClick={() => check.mutate(rows)}>Check</Button>
									<Button type="button" disabled={busy || !canSave(checked, edited)} onClick={() => save.mutate(rows)}>
										{save.isPending ? "Saving..." : `Save ${checked ? checked.toCreate + checked.toUpdate : 0} rows`}
									</Button>
								</div>
							</div>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>#</TableHead>
											<TableHead>What it does</TableHead>
											{columns.map((c) => (
												<TableHead key={c.key} className="whitespace-nowrap">{c.label}</TableHead>
											))}
											<TableHead />
										</TableRow>
									</TableHeader>
									<TableBody>
										{rows.map((row) => {
											const result: BulkRowResult | undefined = resultByRow.get(row.rowNumber);
											const tone = result ? rowTone(result) : "ok";
											return (
												<TableRow key={row.rowNumber} className={tone === "bad" ? "bg-destructive/5" : tone === "warn" ? "bg-amber-500/10" : ""}>
													<TableCell>{row.rowNumber}</TableCell>
													<TableCell className="min-w-64 align-top text-sm">
														{result ? (
															<div className="space-y-1">
																<Badge variant={tone === "bad" ? "destructive" : tone === "warn" ? "secondary" : "default"}>
																	{result.status === "OK" ? ACTION_LABEL[result.action] : result.status === "DUPLICATE" ? "Looks like a duplicate" : "Problem"}
																</Badge>
																{result.problems.map((p) => (
																	<p key={p} className={result.status === "OK" ? "text-muted-foreground" : "text-destructive"}>{p}</p>
																))}
																{result.candidates.map((c) => (
																	<p key={c.id} className="text-muted-foreground">Same as: {c.name} (ID {c.id}){c.place ? `, ${c.place}` : ""}</p>
																))}
																{result.changes.map((c) => (
																	<p key={c.field} className="text-muted-foreground">{c.field}: {c.from || "empty"} → {c.to}</p>
																))}
															</div>
														) : (
															<span className="text-muted-foreground">Not checked</span>
														)}
													</TableCell>
													{columns.map((c) => (
														<TableCell key={c.key} className="align-top">
															<Input
																aria-label={`${c.label}, row ${row.rowNumber}`}
																className="h-8 min-w-32"
																value={row.values[c.key] ?? ""}
																disabled={busy}
																onChange={(e) => edit(row.rowNumber, c.key, e.target.value)}
															/>
														</TableCell>
													))}
													<TableCell className="align-top">
														<Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => remove(row.rowNumber)}>Remove</Button>
													</TableCell>
												</TableRow>
											);
										})}
										{rows.length === 0 && (
											<TableRow>
												<TableCell colSpan={columns.length + 3} className="text-center text-muted-foreground">No rows left. Start again with another file.</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
