"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	fetchDistrictOptions,
	fetchHospitalTypeOptions,
	fetchOrganizationTypeOptions,
} from "@/api/directory";
import {
	DebouncedSearch,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import { useUrlParams } from "@/hooks/use-url-params";
import { Button } from "@/components/ui/button";
import { enumName, placeName } from "@/lib/names";

const STATIC = { staleTime: 60 * 60 * 1000 };

export default function HospitalFilters() {
	const t = useTranslations("hospitals");
	const locale = useLocale();
	const { get, set, clear, hasFilters } = useUrlParams();

	const districts = useQuery({
		queryKey: ["districts"],
		queryFn: fetchDistrictOptions,
		...STATIC,
	});
	const types = useQuery({
		queryKey: ["hospital-types"],
		queryFn: fetchHospitalTypeOptions,
		...STATIC,
	});
	const orgs = useQuery({
		queryKey: ["organization-types"],
		queryFn: fetchOrganizationTypeOptions,
		...STATIC,
	});

	const flags = [
		{ key: "emergency", label: t("emergencyService") },
		{ key: "ambulance", label: t("ambulanceService") },
		{ key: "blood", label: t("bloodBank") },
	];

	return (
		<form
			role="search"
			aria-label={t("filterForm")}
			onSubmit={(e) => e.preventDefault()}
			className="space-y-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24"
		>
			<h2 className="text-lg font-bold text-primary">{t("filters")}</h2>

			<div className="space-y-2">
				<Label>{t("hospitalName")}</Label>
				<DebouncedSearch
					label={t("hospitalName")}
					placeholder={t("searchByName")}
					value={get("q")}
					onChange={(v) => set({ q: v })}
				/>
			</div>

			<div className="space-y-2">
				<Label>{t("district")}</Label>
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
			</div>

			<div className="space-y-2">
				<Label>{t("hospitalType")}</Label>
				<FilterSelect
					label={t("hospitalType")}
					allLabel={t("allTypes")}
					value={get("type")}
					onChange={(v) => set({ type: v })}
					disabled={types.isLoading}
					options={(types.data ?? []).map((type) => ({
						value: type.value ?? type.englishName,
						label: enumName(locale, type),
					}))}
				/>
			</div>

			<div className="space-y-2">
				<Label>{t("organization")}</Label>
				<FilterSelect
					label={t("organization")}
					allLabel={t("allOrganizations")}
					value={get("org")}
					onChange={(v) => set({ org: v })}
					disabled={orgs.isLoading}
					options={(orgs.data ?? []).map((o) => ({
						value: o.value ?? o.englishName,
						label: enumName(locale, o),
					}))}
				/>
			</div>

			<fieldset className="space-y-3">
				<legend className="mb-2 text-sm font-medium">{t("services")}</legend>
				{flags.map((f) => (
					<div key={f.key} className="flex min-h-8 items-center gap-3">
						<Checkbox
							id={`flag-${f.key}`}
							checked={get(f.key) === "1"}
							onCheckedChange={(c) => set({ [f.key]: c ? "1" : undefined })}
						/>
						<Label htmlFor={`flag-${f.key}`} className="font-normal">
							{f.label}
						</Label>
					</div>
				))}
			</fieldset>

			{hasFilters && (
				<Button type="button" variant="outline" className="h-11 w-full" onClick={clear}>
					{t("clearAll")}
				</Button>
			)}
		</form>
	);
}
