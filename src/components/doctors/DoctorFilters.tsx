"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { fetchDistrictOptions, fetchSpecialityOptions } from "@/api/directory";
import {
	DebouncedSearch,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";
import { placeName } from "@/lib/names";
import type { MedicalSpeciality } from "@/types/doctors";

const STATIC = { staleTime: 60 * 60 * 1000 };

/** A sub-specialty can sit under several parents (Adolescent medicine under both Pediatrics and Internal medicine); name the parent so the repeats can be told apart. */
function specialityOptions(list: MedicalSpeciality[], locale: string) {
	const byId = new Map(list.map((s) => [s.id, s]));
	const counts = new Map<string, number>();
	for (const s of list) counts.set(placeName(locale, s), (counts.get(placeName(locale, s)) ?? 0) + 1);
	return list
		.map((s) => {
			const own = placeName(locale, s);
			const parent = s.parentId ? placeName(locale, byId.get(s.parentId)) : "";
			const repeated = (counts.get(own) ?? 0) > 1;
			return { value: String(s.id), label: repeated && parent ? `${own} (${parent})` : own };
		})
		.sort((a, b) => a.label.localeCompare(b.label, locale));
}

export default function DoctorFilters() {
	const t = useTranslations("doctors");
	const locale = useLocale();
	const { get, set, clear, hasFilters } = useUrlParams();

	const districts = useQuery({
		queryKey: ["districts"],
		queryFn: fetchDistrictOptions,
		...STATIC,
	});
	const specialities = useQuery({
		queryKey: ["specialities"],
		queryFn: fetchSpecialityOptions,
		...STATIC,
	});

	return (
		<form
			role="search"
			aria-label={t("filterForm")}
			onSubmit={(e) => e.preventDefault()}
			className="mb-6 rounded-xl border border-border bg-card p-5"
		>
			<div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-center">
				<DebouncedSearch
					label={t("searchByName")}
					placeholder={t("searchByName")}
					value={get("q")}
					onChange={(v) => set({ q: v })}
				/>
				<FilterSelect
					label={t("specialty")}
					allLabel={t("allSpecialties")}
					value={get("speciality")}
					onChange={(v) => set({ speciality: v })}
					disabled={specialities.isLoading}
					options={specialityOptions(specialities.data ?? [], locale)}
				/>
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
