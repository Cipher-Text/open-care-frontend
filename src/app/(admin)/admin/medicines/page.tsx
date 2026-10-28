"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchManufacturers, fetchMedicines } from "@/api/medicines";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 20;

export default function MedicinesPage() {
	const [term, setTerm] = useState("");
	const [search, setSearch] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [page, setPage] = useState(1);

	const manufacturers = useQuery({ queryKey: ["medicine-manufacturers"], queryFn: fetchManufacturers, staleTime: 60 * 60 * 1000 });
	const companyOptions = [{ value: "", label: "All companies" }, ...(manufacturers.data ?? []).map((name) => ({ value: name, label: name }))];

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["medicines", search, manufacturer, page],
		queryFn: () => fetchMedicines({ term: search, manufacturer, page, size: PAGE_SIZE }),
		placeholderData: (previous) => previous,
	});

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		setPage(1);
		setSearch(term.trim());
	};

	return (
		<div className="flex flex-col">
			<AdminHeader title="Medicines" description="Browse the medicine catalogue" />
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<form onSubmit={submit} className="flex flex-wrap gap-2">
					<div className="w-full sm:w-72">
						<SearchableSelect
							value={manufacturer}
							onValueChange={(value) => {
								setManufacturer(value);
								setPage(1);
							}}
							options={companyOptions}
							placeholder="All companies"
							searchPlaceholder="Search companies..."
							emptyText="No company found."
							disabled={manufacturers.isLoading}
						/>
					</div>
					<div className="relative min-w-56 flex-1 sm:max-w-sm">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							className="pl-8"
							placeholder="Search by brand or generic name"
							value={term}
							onChange={(event) => setTerm(event.target.value)}
						/>
					</div>
					<Button type="submit">Search</Button>
				</form>
				<Card>
					<CardContent className="pt-6">
						{isError ? (
							<div className="text-center text-red-600">
								Error loading medicines: {(error as Error).message}
							</div>
						) : isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Brand</TableHead>
										<TableHead>Generic</TableHead>
										<TableHead>Form</TableHead>
										<TableHead>Strength</TableHead>
										<TableHead>Manufacturer</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(data?.content ?? []).map((medicine) => (
										<TableRow key={medicine.id}>
											<TableCell className="font-medium">{medicine.brandName}</TableCell>
											<TableCell>{medicine.generic}</TableCell>
											<TableCell>{medicine.dosageForm}</TableCell>
											<TableCell>{medicine.strength}</TableCell>
											<TableCell>{medicine.manufacturer}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
						<div className="mt-4 flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={!data || page >= data.totalPages}
								onClick={() => setPage(page + 1)}
							>
								Next
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
