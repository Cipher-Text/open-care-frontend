"use client";

import { useQuery } from "@tanstack/react-query";
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

const STATIC = { staleTime: 60 * 60 * 1000 };

export default function HospitalFilters() {
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
		{ key: "emergency", label: "Emergency service" },
		{ key: "ambulance", label: "Ambulance service" },
		{ key: "blood", label: "Blood bank" },
	];

	return (
		<form
			role="search"
			aria-label="Filter hospitals"
			onSubmit={(e) => e.preventDefault()}
			className="space-y-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24"
		>
			<h2 className="text-lg font-bold text-primary">Filters</h2>

			<div className="space-y-2">
				<Label>Hospital name</Label>
				<DebouncedSearch
					label="Hospital name"
					placeholder="Search by name"
					value={get("q")}
					onChange={(v) => set({ q: v })}
				/>
			</div>

			<div className="space-y-2">
				<Label>District</Label>
				<FilterSelect
					label="District"
					allLabel="All districts"
					value={get("district")}
					onChange={(v) => set({ district: v })}
					disabled={districts.isLoading}
					options={(districts.data ?? [])
						.slice()
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((d) => ({ value: String(d.id), label: d.name }))}
				/>
			</div>

			<div className="space-y-2">
				<Label>Hospital type</Label>
				<FilterSelect
					label="Hospital type"
					allLabel="All types"
					value={get("type")}
					onChange={(v) => set({ type: v })}
					disabled={types.isLoading}
					options={(types.data ?? []).map((t) => ({
						value: t.value ?? t.englishName,
						label: t.englishName,
					}))}
				/>
			</div>

			<div className="space-y-2">
				<Label>Organization</Label>
				<FilterSelect
					label="Organization"
					allLabel="All organizations"
					value={get("org")}
					onChange={(v) => set({ org: v })}
					disabled={orgs.isLoading}
					options={(orgs.data ?? []).map((o) => ({
						value: o.value ?? o.englishName,
						label: o.displayName ?? o.englishName,
					}))}
				/>
			</div>

			<fieldset className="space-y-3">
				<legend className="mb-2 text-sm font-medium">Services</legend>
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
					Clear all filters
				</Button>
			)}
		</form>
	);
}
