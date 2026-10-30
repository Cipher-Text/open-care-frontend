"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
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

/** `label` is a key of hospitals.* in the message files. */
const SORTS: Record<string, { sortBy: string; sortDir: "ASC" | "DESC"; label: string }> = {
	name: { sortBy: "name", sortDir: "ASC", label: "sortName" },
	beds: { sortBy: "numberOfBed", sortDir: "DESC", label: "sortBeds" },
};

export default function HospitalsList() {
	const t = useTranslations("hospitals");
	const locale = useLocale();
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));
	const chosen = SORTS[get("sort")] ?? SORTS.name;
	// In Bangla, "Name (A-Z)" sorts by the Bangla name, in Bangla alphabetical order (the database collates bn_name that way)
	const sort = chosen === SORTS.name && locale === "bn" ? { ...chosen, sortBy: "bnName" } : chosen;

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
					{data ? t("found", { count: data.totalItems }) : t("searching")}
				</p>
				<div className="w-full sm:w-52">
					<FilterSelect
						label={t("sortBy")}
						allLabel={t(SORTS.name.label)}
						value={get("sort") === "beds" ? "beds" : ""}
						onChange={(v) => set({ sort: v })}
						options={[{ value: "beds", label: t(SORTS.beds.label) }]}
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
