"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { fetchPublicNurses } from "@/api/public-nurses";
import { DirectoryPagination } from "@/components/common/DirectoryControls";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import NextLink from "next/link";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import { qk } from "@/lib/query-keys";
import NurseCard from "./NurseCard";

const PAGE_SIZE = 10;

export default function NursesList() {
	const t = useTranslations("nurses");
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));

	const query = useQuery({
		queryKey: [...qk.publicNurses, get("q"), get("district"), page],
		queryFn: () => fetchPublicNurses({ name: get("q") || undefined, districtId: get("district") || undefined, page, size: PAGE_SIZE }),
		placeholderData: keepPreviousData,
	});
	const data = query.data;
	// An inactive nurse is not shown (the API lists every record)
	const nurses = (data?.content ?? []).filter((n) => n.isActive !== false);
	// The count follows what is shown: inactive nurses on this page are not in it
	const count = Math.max(0, (data?.totalItems ?? 0) - ((data?.content ?? []).length - nurses.length));

	return (
		<div className="space-y-6">
			<p className="text-muted-foreground" aria-live="polite">
				{data ? t("found", { count }) : t("searching")}
			</p>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && nurses.length === 0 ? (
				<EmptyState onClear={hasFilters ? clear : undefined} />
			) : (
				<div className={`space-y-4 ${query.isPlaceholderData ? "opacity-60" : ""}`}>
					{nurses.map((n) => (
						<NurseCard key={n.id} nurse={n} />
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

			<p className="text-sm text-muted-foreground">
				{t("notListed")}{" "}
				<NextLink href="/account/contribute" className="font-medium text-primary hover:underline">
					{t("notListedLink")}
				</NextLink>
			</p>
		</div>
	);
}
