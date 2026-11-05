"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { fetchDistrictOptions } from "@/api/directory";
import { DebouncedSearch, FilterSelect } from "@/components/common/DirectoryControls";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";
import { placeName } from "@/lib/names";
import { qk } from "@/lib/query-keys";

export default function NutritionistFilters() {
	const t = useTranslations("nutritionists");
	const locale = useLocale();
	const { get, set, clear, hasFilters } = useUrlParams();
	const districts = useQuery({ queryKey: [...qk.districts], queryFn: fetchDistrictOptions, staleTime: 60 * 60 * 1000 });

	return (
		<form role="search" aria-label={t("filterForm")} onSubmit={(e) => e.preventDefault()} className="mb-6 rounded-xl border border-border bg-card p-5">
			<div className="grid gap-3 lg:grid-cols-[2fr_1fr_auto] lg:items-center">
				<DebouncedSearch label={t("searchByName")} placeholder={t("searchByName")} value={get("q")} onChange={(v) => set({ q: v })} />
				<FilterSelect
					label={t("district")}
					allLabel={t("allDistricts")}
					value={get("district")}
					onChange={(v) => set({ district: v })}
					disabled={districts.isLoading}
					options={(districts.data ?? [])
						.slice()
						.map((d) => ({ value: String(d.id), label: placeName(locale, d) }))
						.sort((a, b) => a.label.localeCompare(b.label, locale))}
				/>
				{hasFilters && (
					<Button type="button" variant="outline" className="h-11" onClick={clear}>
						{t("clear")}
					</Button>
				)}
			</div>
		</form>
	);
}
