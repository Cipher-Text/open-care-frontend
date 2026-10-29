"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDistrictOptions, fetchSpecialityOptions } from "@/api/directory";
import {
	DebouncedSearch,
	FilterSelect,
} from "@/components/common/DirectoryControls";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";
import type { MedicalSpeciality } from "@/types/doctors";

const STATIC = { staleTime: 60 * 60 * 1000 };

/** A sub-specialty can sit under several parents (Adolescent medicine under both Pediatrics and Internal medicine); name the parent so the repeats can be told apart. */
function specialityOptions(list: MedicalSpeciality[]) {
	const byId = new Map(list.map((s) => [s.id, s]));
	const counts = new Map<string, number>();
	for (const s of list) counts.set(s.name, (counts.get(s.name) ?? 0) + 1);
	return list
		.map((s) => {
			const parent = s.parentId ? byId.get(s.parentId)?.name : undefined;
			const repeated = (counts.get(s.name) ?? 0) > 1;
			return { value: String(s.id), label: repeated && parent ? `${s.name} (${parent})` : s.name };
		})
		.sort((a, b) => a.label.localeCompare(b.label));
}

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
					options={specialityOptions(specialities.data ?? [])}
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
