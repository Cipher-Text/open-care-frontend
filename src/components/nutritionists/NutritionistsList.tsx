"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { fetchPublicNutritionists } from "@/api/public-nutritionists";
import { DirectoryPagination } from "@/components/common/DirectoryControls";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import { parsePage, useUrlParams } from "@/hooks/use-url-params";
import { qk } from "@/lib/query-keys";
import NutritionistCard from "./NutritionistCard";

const PAGE_SIZE = 10;

export default function NutritionistsList() {
	const t = useTranslations("nutritionists");
	const { get, set, clear, hasFilters } = useUrlParams();
	const page = parsePage(get("page"));

	const query = useQuery({
		queryKey: [...qk.publicNutritionists, get("q"), get("district"), page],
		queryFn: () => fetchPublicNutritionists({ name: get("q") || undefined, districtId: get("district") || undefined, page, size: PAGE_SIZE }),
		placeholderData: keepPreviousData,
	});
	const data = query.data;

	return (
		<div className="space-y-6">
			<p className="text-muted-foreground" aria-live="polite">
				{data ? t("found", { count: data.totalItems }) : t("searching")}
			</p>

			{query.isPending ? (
				<ListSkeleton />
			) : query.isError ? (
				<ErrorState onRetry={() => query.refetch()} />
			) : data && data.content.length === 0 ? (
				<EmptyState onClear={hasFilters ? clear : undefined} />
			) : (
				<div className={`space-y-4 ${query.isPlaceholderData ? "opacity-60" : ""}`}>
					{data?.content.map((n) => (
						<NutritionistCard key={n.id} nutritionist={n} />
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
