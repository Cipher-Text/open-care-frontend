"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDistrictOptions, fetchSpecialityOptions } from "@/api/directory";
import {
	DebouncedSearch,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";

const STATIC = { staleTime: 60 * 60 * 1000 };

export default function DoctorFilters() {
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
			aria-label="Filter doctors"
			onSubmit={(e) => e.preventDefault()}
			className="mb-6 rounded-xl border border-border bg-card p-5"
		>
			<div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-center">
				<DebouncedSearch
					label="Search doctors by name"
					placeholder="Search doctors by name"
					value={get("q")}
					onChange={(v) => set({ q: v })}
				/>
				<FilterSelect
					label="Specialty"
					allLabel="All specialties"
					value={get("speciality")}
					onChange={(v) => set({ speciality: v })}
					disabled={specialities.isLoading}
					options={(specialities.data ?? [])
						.slice()
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((s) => ({ value: String(s.id), label: s.name }))}
				/>
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
				{hasFilters && (
					<Button type="button" variant="outline" className="h-11" onClick={clear}>
						Clear
					</Button>
				)}
			</div>
		</form>
	);
}
