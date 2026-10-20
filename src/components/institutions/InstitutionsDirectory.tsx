"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	fetchDistrictOptions,
	fetchOrganizationTypeOptions,
	fetchPublicInstitutions,
} from "@/api/directory";
import {
	DebouncedSearch,
	DirectoryPagination,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import InstitutionCard from "./InstitutionCard";

const PAGE_SIZE = 12;

export default function InstitutionsDirectory() {
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));

	const districts = useQuery({ queryKey: ["districts"], queryFn: fetchDistrictOptions });
	const orgs = useQuery({ queryKey: ["organization-types"], queryFn: fetchOrganizationTypeOptions });

	const query = useQuery({
		queryKey: ["public-institutions", get("q"), get("district"), get("org"), page],
		queryFn: () =>
			fetchPublicInstitutions({
				name: get("q") || undefined,
				districtId: get("district") || undefined,
				organizationType: get("org") || undefined,
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
				aria-label="Filter institutions"
				onSubmit={(e) => e.preventDefault()}
				className="grid gap-3 rounded-xl border bg-card p-5 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-center"
			>
				<DebouncedSearch
					label="Institution name"
					placeholder="Search by name"
					value={get("q")}
					onChange={(v) => set({ q: v })}
				/>
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
					label="Ownership"
					allLabel="Government and private"
					value={get("org")}
					onChange={(v) => set({ org: v })}
					disabled={orgs.isLoading}
					options={(orgs.data ?? []).map((o) => ({
						value: o.value ?? o.englishName,
						label: o.displayName ?? o.englishName,
					}))}
				/>
				{hasFilters && (
					<Button type="button" variant="outline" className="h-11" onClick={clear}>
						Clear
					</Button>
				)}
			</form>

			<p className="text-muted-foreground" aria-live="polite">
				{data ? `${data.totalItems.toLocaleString()} ${data.totalItems === 1 ? "institution" : "institutions"} found` : "Searching"}
			</p>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && data.content.length === 0 ? (
				<EmptyState onClear={hasFilters ? clear : undefined} />
			) : (
				<div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${query.isPlaceholderData ? "opacity-60" : ""}`}>
					{data?.content.map((i) => (
						<InstitutionCard key={i.id} institution={i} />
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
