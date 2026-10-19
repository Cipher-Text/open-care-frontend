"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPublicDoctors } from "@/api/directory";
import { DirectoryPagination } from "@/components/common/DirectoryControls";
import {
	EmptyState,
	ErrorState,
	ListSkeleton,
} from "@/components/common/StateViews";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import DoctorCard from "./DoctorCard";

const PAGE_SIZE = 10;

export default function DoctorsList() {
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));

	const query = useQuery({
		queryKey: [
			"public-doctors",
			get("q"),
			get("speciality"),
			get("district"),
			page,
		],
		queryFn: () =>
			fetchPublicDoctors({
				name: get("q") || undefined,
				specialityId: get("speciality") || undefined,
				districtId: get("district") || undefined,
				page,
				size: PAGE_SIZE,
			}),
		placeholderData: keepPreviousData,
	});

	const data = query.data;

	return (
		<div className="space-y-6">
			<p className="text-muted-foreground" aria-live="polite">
				{data
					? `${data.totalItems.toLocaleString()} ${
							data.totalItems === 1 ? "doctor" : "doctors"
					  } found`
					: "Searching"}
			</p>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && data.content.length === 0 ? (
				<EmptyState onClear={hasFilters ? clear : undefined} />
			) : (
				<div
					className={`space-y-4 ${query.isPlaceholderData ? "opacity-60" : ""}`}
				>
					{data?.content.map((d) => (
						<DoctorCard key={d.id} doctor={d} />
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
