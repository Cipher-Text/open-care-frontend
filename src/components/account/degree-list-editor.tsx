"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { fetchNutritionDegreeOptions, searchInstitutionNames } from "@/api/nutritionists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { degreeProblem, emptyDegree, MAX_DEGREES, type DegreeRow } from "@/lib/degree-rows";

const OTHER = "other";

/**
 * Several degrees, each with its institution, year and grade. A degree is picked from the nutrition list, or "Other" lets the person
 * type it (so nobody is stopped by a degree that is not listed yet). The institution is typed, and suggestions from the institution list
 * are offered: when the typed name is one of them, the row keeps the link to it.
 */
export function DegreeListEditor({ rows, onChange, idPrefix = "degree" }: { rows: DegreeRow[]; onChange: (rows: DegreeRow[]) => void; idPrefix?: string }) {
	const options = useQuery({ queryKey: ["nutrition-degree-options"], queryFn: fetchNutritionDegreeOptions, staleTime: 3_600_000, retry: false });
	const problem = degreeProblem(rows);
	const update = (index: number, patch: Partial<DegreeRow>) => onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));

	return (
		<fieldset className="space-y-3">
			<legend className="text-sm font-medium">Degrees and qualifications</legend>
			{rows.length === 0 && <p className="text-sm text-muted-foreground">No degrees yet.</p>}
			{rows.map((row, index) => (
				<DegreeRowEditor key={index} row={row} index={index} idPrefix={idPrefix} degrees={options.data ?? []} onPatch={(patch) => update(index, patch)} onRemove={() => onChange(rows.filter((_, i) => i !== index))} />
			))}
			{problem && <p role="alert" className="text-sm text-destructive">{problem}</p>}
			<Button type="button" variant="outline" size="sm" disabled={rows.length >= MAX_DEGREES} onClick={() => onChange([...rows, emptyDegree()])}>
				<Plus className="mr-2 size-4" aria-hidden="true" />
				Add a degree
			</Button>
		</fieldset>
	);
}

function DegreeRowEditor({ row, index, idPrefix, degrees, onPatch, onRemove }: { row: DegreeRow; index: number; idPrefix: string; degrees: { id: number; name: string }[]; onPatch: (patch: Partial<DegreeRow>) => void; onRemove: () => void }) {
	const suggestions = useQuery({
		queryKey: ["institution-names", row.institutionName.trim()],
		queryFn: () => searchInstitutionNames(row.institutionName),
		enabled: row.institutionName.trim().length >= 3,
		staleTime: 60_000,
		retry: false,
	});
	const listId = `${idPrefix}-${index}-institutions`;
	const selectValue = row.degreeId !== "" ? row.degreeId : row.typed ? OTHER : "";

	return (
		<div className="space-y-2 rounded-md border p-3">
			<div className="flex items-end gap-2">
				<div className="min-w-0 flex-1 space-y-1">
					<Label htmlFor={`${idPrefix}-${index}-degree`}>Degree</Label>
					<NativeSelect
						id={`${idPrefix}-${index}-degree`}
						value={selectValue}
						onChange={(e) => {
							const value = e.target.value;
							if (value === OTHER) onPatch({ degreeId: "", typed: true });
							else if (value === "") onPatch({ degreeId: "", typed: false, degreeName: "" });
							else onPatch({ degreeId: value, typed: false, degreeName: degrees.find((d) => String(d.id) === value)?.name ?? "" });
						}}
					>
						<option value="">Choose a degree</option>
						{degrees.map((d) => (
							<option key={d.id} value={d.id}>{d.name}</option>
						))}
						<option value={OTHER}>Other: my degree is not listed</option>
					</NativeSelect>
				</div>
				<Button type="button" variant="ghost" size="icon" aria-label={`Remove degree ${index + 1}`} onClick={onRemove}>
					<Trash2 className="size-4" aria-hidden="true" />
				</Button>
			</div>
			{row.typed && (
				<div className="space-y-1">
					<Label htmlFor={`${idPrefix}-${index}-name`}>Name of the degree</Label>
					<Input id={`${idPrefix}-${index}-name`} value={row.degreeName} maxLength={200} placeholder="For example Certificate in Sports Nutrition" onChange={(e) => onPatch({ degreeName: e.target.value })} />
				</div>
			)}
			<div className="grid gap-2 sm:grid-cols-[1fr_7rem_8rem]">
				<div className="space-y-1">
					<Label htmlFor={`${idPrefix}-${index}-institution`}>Institution</Label>
					<Input
						id={`${idPrefix}-${index}-institution`}
						list={listId}
						value={row.institutionName}
						maxLength={300}
						autoComplete="off"
						onChange={(e) => {
							const name = e.target.value;
							const match = suggestions.data?.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
							onPatch({ institutionName: name, institutionId: match ? String(match.id) : "" });
						}}
					/>
					<datalist id={listId}>
						{(suggestions.data ?? []).map((s) => (
							<option key={s.id} value={s.name} />
						))}
					</datalist>
				</div>
				<div className="space-y-1">
					<Label htmlFor={`${idPrefix}-${index}-year`}>Year</Label>
					<Input id={`${idPrefix}-${index}-year`} inputMode="numeric" value={row.passingYear} maxLength={4} placeholder="2020" onChange={(e) => onPatch({ passingYear: e.target.value })} />
				</div>
				<div className="space-y-1">
					<Label htmlFor={`${idPrefix}-${index}-grade`}>Grade</Label>
					<Input id={`${idPrefix}-${index}-grade`} value={row.grade} maxLength={50} onChange={(e) => onPatch({ grade: e.target.value })} />
				</div>
			</div>
		</div>
	);
}
