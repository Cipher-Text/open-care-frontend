"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { degreeProblem, emptyDegree, MAX_DEGREES, type DegreeRow } from "@/lib/degree-rows";

/** Several degrees, each with its institution, year and grade: add, change and remove rows. */
export function DegreeListEditor({ rows, onChange, idPrefix = "degree" }: { rows: DegreeRow[]; onChange: (rows: DegreeRow[]) => void; idPrefix?: string }) {
	const set = (index: number, key: keyof DegreeRow, value: string) => onChange(rows.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
	const problem = degreeProblem(rows);

	return (
		<fieldset className="space-y-3">
			<legend className="text-sm font-medium">Degrees and qualifications</legend>
			{rows.length === 0 && <p className="text-sm text-muted-foreground">No degrees yet.</p>}
			{rows.map((row, index) => (
				<div key={index} className="space-y-2 rounded-md border p-3">
					<div className="flex items-end gap-2">
						<div className="min-w-0 flex-1 space-y-1">
							<Label htmlFor={`${idPrefix}-${index}-name`}>Degree</Label>
							<Input id={`${idPrefix}-${index}-name`} value={row.degreeName} maxLength={200} placeholder="For example BSc in Food and Nutrition" onChange={(e) => set(index, "degreeName", e.target.value)} />
						</div>
						<Button type="button" variant="ghost" size="icon" aria-label={`Remove degree ${index + 1}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
							<Trash2 className="size-4" aria-hidden="true" />
						</Button>
					</div>
					<div className="grid gap-2 sm:grid-cols-[1fr_7rem_8rem]">
						<div className="space-y-1">
							<Label htmlFor={`${idPrefix}-${index}-institution`}>Institution</Label>
							<Input id={`${idPrefix}-${index}-institution`} value={row.institutionName} maxLength={300} onChange={(e) => set(index, "institutionName", e.target.value)} />
						</div>
						<div className="space-y-1">
							<Label htmlFor={`${idPrefix}-${index}-year`}>Year</Label>
							<Input id={`${idPrefix}-${index}-year`} inputMode="numeric" value={row.passingYear} maxLength={4} placeholder="2020" onChange={(e) => set(index, "passingYear", e.target.value)} />
						</div>
						<div className="space-y-1">
							<Label htmlFor={`${idPrefix}-${index}-grade`}>Grade</Label>
							<Input id={`${idPrefix}-${index}-grade`} value={row.grade} maxLength={50} onChange={(e) => set(index, "grade", e.target.value)} />
						</div>
					</div>
				</div>
			))}
			{problem && <p role="alert" className="text-sm text-destructive">{problem}</p>}
			<Button type="button" variant="outline" size="sm" disabled={rows.length >= MAX_DEGREES} onClick={() => onChange([...rows, emptyDegree()])}>
				<Plus className="mr-2 size-4" aria-hidden="true" />
				Add a degree
			</Button>
		</fieldset>
	);
}
