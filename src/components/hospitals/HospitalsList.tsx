"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPublicHospitals } from "@/api/directory";
import {
	DirectoryPagination,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import {
	EmptyState,
	ErrorState,
	ListSkeleton,
} from "@/components/common/StateViews";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import HospitalCard from "./HospitalCard";

const PAGE_SIZE = 12;

const SORTS: Record<string, { sortBy: string; sortDir: "ASC" | "DESC"; label: string }> = {
	name: { sortBy: "name", sortDir: "ASC", label: "Name (A-Z)" },
	beds: { sortBy: "numberOfBed", sortDir: "DESC", label: "Most beds" },
};

export default function HospitalsList() {
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));
	const sort = SORTS[get("sort")] ?? SORTS.name;

	const query = useQuery({
		queryKey: [
			"public-hospitals",
			get("q"),
			get("district"),
			get("type"),
			get("org"),
			get("emergency"),
			get("ambulance"),
			get("blood"),
			sort.sortBy,
			page,
		],
		queryFn: () =>
			fetchPublicHospitals({
				name: get("q") || undefined,
				districtId: get("district") || undefined,
				hospitalTypes: get("type") || undefined,
				organizationType: get("org") || undefined,
				hasEmergencyService: get("emergency") === "1" ? true : undefined,
				hasAmbulanceService: get("ambulance") === "1" ? true : undefined,
				hasBloodBank: get("blood") === "1" ? true : undefined,
				sortBy: sort.sortBy,
				sortDir: sort.sortDir,
				page,
				size: PAGE_SIZE,
			}),
		placeholderData: keepPreviousData,
	});

	const data = query.data;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-muted-foreground" aria-live="polite">
					{data
						? `${data.totalItems.toLocaleString()} ${
								data.totalItems === 1 ? "hospital" : "hospitals"
						  } found`
						: "Searching"}
				</p>
				<div className="w-full sm:w-52">
					<FilterSelect
						label="Sort by"
						allLabel={SORTS.name.label}
						value={get("sort") === "beds" ? "beds" : ""}
						onChange={(v) => set({ sort: v })}
						options={[{ value: "beds", label: SORTS.beds.label }]}
					/>
				</div>
			</div>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && data.content.length === 0 ? (
				<EmptyState onClear={hasFilters ? clear : undefined} />
			) : (
				<div
					className={`grid gap-5 sm:grid-cols-2 ${
						query.isPlaceholderData ? "opacity-60" : ""
					}`}
				>
					{data?.content.map((h) => (
						<HospitalCard key={h.id} hospital={h} />
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
