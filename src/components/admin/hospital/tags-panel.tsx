"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import { fetchAllTags, saveHospitalTags } from "@/api/hospital-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/use-permissions";
import { Tag } from "@/types/hospitals";
import { EmptyRow, ManageSection } from "./manage-section";

const MAX_TAGS = 20;

export function TagsPanel({ hospitalId, tags }: { hospitalId: number; tags: Tag[] }) {
	const queryClient = useQueryClient();
	const { hasPermission } = usePermissions();
	const canEdit = hasPermission("update-hospital");
	const [editing, setEditing] = useState(false);
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [filter, setFilter] = useState("");

	const catalogue = useQuery({ queryKey: ["tag-catalogue"], queryFn: fetchAllTags, enabled: editing, staleTime: 60 * 60 * 1000 });

	useEffect(() => {
		if (editing) {
			setSelected(new Set(tags.map((t) => t.id)));
			setFilter("");
		}
	}, [editing, tags]);

	const save = useMutation({
		mutationFn: () => saveHospitalTags(hospitalId, [...selected]),
		onSuccess: () => {
			toast.success("Tags saved");
			setEditing(false);
			queryClient.invalidateQueries({ queryKey: ["hospital-details", hospitalId] });
		},
	});

	const grouped = useMemo(() => {
		const term = filter.trim().toLowerCase();
		const groups = new Map<string, Tag[]>();
		for (const tag of catalogue.data ?? []) {
			if (term && !`${tag.displayName} ${tag.name}`.toLowerCase().includes(term)) continue;
			const list = groups.get(tag.category) ?? [];
			list.push(tag);
			groups.set(tag.category, list);
		}
		return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [catalogue.data, filter]);

	const toggle = (id: number) =>
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else if (next.size < MAX_TAGS) next.add(id);
			return next;
		});

	return (
		<ManageSection
			title="Tags"
			count={tags.length}
			icon={<TagIcon className="size-5" aria-hidden="true" />}
			addLabel="Edit tags"
			onAdd={canEdit && !editing ? () => setEditing(true) : undefined}
		>
			{!editing ? (
				tags.length === 0 ? (
					<EmptyRow>No tags yet.</EmptyRow>
				) : (
					<ul className="flex flex-wrap gap-2">
						{tags.map((t) => (
							<li key={t.id} className="rounded-full border px-3 py-1 text-sm">
								{t.displayName || t.name}
								<span className="ml-1.5 text-xs text-muted-foreground">{t.category}</span>
							</li>
						))}
					</ul>
				)
			) : (
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<Input
							aria-label="Filter tags"
							placeholder="Filter tags"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="max-w-xs"
						/>
						<p className="text-sm text-muted-foreground" aria-live="polite">
							{selected.size} of {MAX_TAGS} selected
						</p>
					</div>
					{catalogue.isLoading && <EmptyRow>Loading tags...</EmptyRow>}
					{catalogue.isError && (
						<p role="alert" className="text-sm text-destructive">
							{(catalogue.error as Error).message}
						</p>
					)}
					<div className="max-h-80 space-y-4 overflow-auto pr-1">
						{grouped.map(([category, list]) => (
							<fieldset key={category}>
								<legend className="mb-1.5 text-sm font-semibold">{category}</legend>
								<div className="flex flex-wrap gap-2">
									{list.map((tag) => {
										const on = selected.has(tag.id);
										return (
											<button
												key={tag.id}
												type="button"
												aria-pressed={on}
												onClick={() => toggle(tag.id)}
												className={`rounded-full border px-3 py-1 text-sm transition-colors ${
													on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
												}`}
											>
												{tag.displayName || tag.name}
											</button>
										);
									})}
								</div>
							</fieldset>
						))}
					</div>
					{save.isError && (
						<p role="alert" className="text-sm text-destructive">
							{(save.error as Error).message}
						</p>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setEditing(false)} disabled={save.isPending}>
							Cancel
						</Button>
						<Button onClick={() => save.mutate()} disabled={save.isPending}>
							{save.isPending ? "Saving..." : "Save tags"}
						</Button>
					</div>
				</div>
			)}
		</ManageSection>
	);
}
