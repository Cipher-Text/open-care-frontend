"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminNutritionists } from "@/api/nutritionists";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { qk } from "@/lib/query-keys";

const PAGE_SIZE = 10;
const TITLES = { NUTRITIONIST: "Nutritionist", DIETITIAN: "Dietitian" } as const;

/** Nutritionists and dietitians with their private details, for staff who create or delete them. Verification requests are in Verification. */
export default function NutritionistsAdminPage() {
	const [name, setName] = useState("");
	const [verified, setVerified] = useState<"" | "true" | "false">("");
	const [page, setPage] = useState(1);
	const list = useQuery({
		queryKey: [...qk.adminNutritionists, name, verified, page],
		queryFn: () => fetchAdminNutritionists({ name: name.trim() || undefined, isVerified: verified === "" ? undefined : verified === "true", page, size: PAGE_SIZE }),
		placeholderData: (previous) => previous,
	});

	return (
		<div className="flex flex-col">
			<AdminHeader title="Nutritionists" description="Nutritionists and dietitians. They are not doctors and cannot prescribe." />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-64">
						<Input aria-label="Search by name" placeholder="Search by name" value={name} onChange={(e) => { setName(e.target.value); setPage(1); }} />
					</div>
					<div className="w-full sm:w-48">
						<NativeSelect aria-label="Verification" value={verified} onChange={(e) => { setVerified(e.target.value as "" | "true" | "false"); setPage(1); }}>
							<option value="">All</option>
							<option value="true">Verified</option>
							<option value="false">Not verified</option>
						</NativeSelect>
					</div>
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the nutritionists"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Title</TableHead>
										<TableHead>Registration</TableHead>
										<TableHead>Qualifications</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(list.data?.content ?? []).map((n) => (
										<TableRow key={n.id}>
											<TableCell className="font-medium">
												<Link href={`/nutritionists/${n.id}`} className="hover:underline">{n.profile?.name ?? `#${n.id}`}</Link>
											</TableCell>
											<TableCell>{TITLES[n.title] ?? n.title}</TableCell>
											<TableCell>{n.registrationNo ?? "-"}</TableCell>
											<TableCell className="max-w-64 truncate">{n.degrees ?? "-"}</TableCell>
											<TableCell>{n.profile?.phone ?? "-"}</TableCell>
											<TableCell className="space-x-1 whitespace-nowrap">
												<Badge variant={n.isVerified ? "default" : "secondary"}>{n.isVerified ? "Verified" : "Not verified"}</Badge>
												{n.isActive === false && <Badge variant="destructive">Inactive</Badge>}
											</TableCell>
										</TableRow>
									))}
									{(list.data?.content ?? []).length === 0 && (
										<TableRow>
											<TableCell colSpan={6} className="text-center text-muted-foreground">Nothing in this list.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{list.data && list.data.totalPages > 1 && (
							<div className="flex items-center justify-end gap-3 pt-4 text-sm">
								<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
								<span>Page {list.data.currentPage} of {list.data.totalPages}</span>
								<Button variant="outline" size="sm" disabled={page >= list.data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
