"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	fetchAmbulanceTypeOptions,
	fetchDistrictOptions,
	fetchPublicAmbulances,
} from "@/api/directory";
import { DirectoryPagination, FilterSelect } from "@/components/common/DirectoryControls";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import AmbulanceCard from "./AmbulanceCard";

const PAGE_SIZE = 12;

export default function AmbulancesDirectory() {
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));

	const districts = useQuery({ queryKey: ["districts"], queryFn: fetchDistrictOptions });
	const types = useQuery({ queryKey: ["ambulance-types"], queryFn: fetchAmbulanceTypeOptions });

	const query = useQuery({
		queryKey: ["public-ambulances", get("district"), get("type"), get("available"), page],
		queryFn: () =>
			fetchPublicAmbulances({
				districtId: get("district") || undefined,
				type: get("type") || undefined,
				isAvailable: get("available") === "1" ? true : undefined,
				page,
				size: PAGE_SIZE,
			}),
		placeholderData: keepPreviousData,
	});
	const data = query.data;

	return (
		<div className="space-y-6">
			<form
				role="search"
				aria-label="Filter ambulances"
				onSubmit={(e) => e.preventDefault()}
				className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center"
			>
				<FilterSelect
					label="District"
					allLabel="All districts"
					value={get("district")}
					onChange={(v) => set({ district: v })}
					disabled={districts.isLoading}
					options={(districts.data ?? [])
						.filter((d) => !/not\s*available/i.test(d.name))
						.slice()
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((d) => ({ value: String(d.id), label: d.name }))}
				/>
				<FilterSelect
					label="Ambulance type"
					allLabel="All types"
					value={get("type")}
					onChange={(v) => set({ type: v })}
					disabled={types.isLoading}
					options={(types.data ?? []).map((t) => ({ value: t.value, label: t.description }))}
				/>
				<div className="flex min-h-11 items-center gap-2">
					<Checkbox
						id="available-now"
						checked={get("available") === "1"}
						onCheckedChange={(c) => set({ available: c ? "1" : undefined })}
					/>
					<Label htmlFor="available-now" className="font-normal">
						Available now
					</Label>
				</div>
				{hasFilters && (
					<Button type="button" variant="outline" className="h-11" onClick={clear}>
						Clear
					</Button>
				)}
			</form>

			<p className="text-muted-foreground" aria-live="polite">
				{data ? `${data.totalItems.toLocaleString()} ${data.totalItems === 1 ? "ambulance" : "ambulances"} listed` : "Searching"}
			</p>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && data.content.length === 0 ? (
				<EmptyState
					title="No ambulances listed here yet"
					description="Our ambulance list is still small. Try another district, or call 999 in an emergency."
					onClear={hasFilters ? clear : undefined}
				/>
			) : (
				<div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${query.isPlaceholderData ? "opacity-60" : ""}`}>
					{data?.content.map((a) => (
						<AmbulanceCard key={a.id} ambulance={a} />
					))}
				</div>
			)}

			{data && data.totalPages > 1 && (
				<DirectoryPagination
					page={page}
					totalPages={data.totalPages}
					onPageChange={(p) => {
						set({ page: String(p) });
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				/>
			)}
		</div>
	);
}
