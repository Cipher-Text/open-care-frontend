"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDataAccess, type DataAccessKind } from "@/api/data-access";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 25;

/** Every time someone opened another person's health readings, prescription or profile details. */
export default function DataAccessPage() {
	const [kind, setKind] = useState<DataAccessKind | "">("");
	const [actor, setActor] = useState("");
	const [subject, setSubject] = useState("");
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["data-access", kind, actor, subject, page], queryFn: () => fetchDataAccess({ kind, actor, subject, page, size: PAGE_SIZE }), retry: false, placeholderData: (previous) => previous });
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;
	const number = (v: string) => v.replace(/\D/g, "");

	return (
		<div className="flex flex-col">
			<AdminHeader title="Data access log" description="Who opened other people's health readings, prescriptions, profiles, the blood donor list and private files" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="Kind of data" value={kind} onChange={(e) => { setKind(e.target.value as DataAccessKind | ""); setPage(1); }}>
							<option value="">All kinds</option>
							<option value="HEALTH_VITALS">Health readings</option>
							<option value="PRESCRIPTION">Prescriptions</option>
							<option value="PROFILE">Profiles</option>
							<option value="DONOR_LIST">Blood donor list</option>
							<option value="PRIVATE_FILE">Private files</option>
						</NativeSelect>
					</div>
					<Input className="w-full sm:w-44" inputMode="numeric" aria-label="Who looked (profile number)" placeholder="Who looked (profile no.)" value={actor} onChange={(e) => { setActor(number(e.target.value)); setPage(1); }} />
					<Input className="w-full sm:w-44" inputMode="numeric" aria-label="Whose data (profile number)" placeholder="Whose data (profile no.)" value={subject} onChange={(e) => { setSubject(number(e.target.value)); setPage(1); }} />
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the access log"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>When</TableHead>
										<TableHead>Who looked</TableHead>
										<TableHead>Data</TableHead>
										<TableHead>Whose</TableHead>
										<TableHead>What</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((r) => (
										<TableRow key={r.id}>
											<TableCell className="whitespace-nowrap">{dateTime(r.date)}</TableCell>
											<TableCell>
												{r.actorLabel} <span className="text-xs text-muted-foreground">({r.actorType.toLowerCase()}{r.actorProfileId ? ` #${r.actorProfileId}` : ""})</span>
											</TableCell>
											<TableCell>{r.kind.replace("_", " ").toLowerCase()}</TableCell>
											<TableCell>{r.subjectProfileId ? `${r.subjectName ?? "Profile"} #${r.subjectProfileId}` : r.kind === "PRIVATE_FILE" ? "A file" : r.kind === "DONOR_LIST" ? "Donors (a list)" : "Everyone (a list)"}</TableCell>
											<TableCell>{r.action.toLowerCase().replace("_", " ")}{r.detail ? ` · ${r.detail}` : ""}</TableCell>
										</TableRow>
									))}
									{rows.length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">Nothing recorded.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{totalPages > 1 && (
							<div className="mt-4 flex items-center justify-between text-sm">
								<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Newer</Button>
								<span className="text-muted-foreground">Page {page} of {totalPages}</span>
								<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Older</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
