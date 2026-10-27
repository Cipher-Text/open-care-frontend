"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines } from "@/api/prescriptions";
import { Input } from "@/components/ui/input";
import type { MedicineSuggestion } from "@/types/prescriptions";

function useDebounced<T>(value: T, ms: number) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), ms);
		return () => clearTimeout(id);
	}, [value, ms]);
	return debounced;
}

/**
 * Medicine name box with catalogue suggestions. Typing a name that is not in the catalogue is fine
 * (the line is then saved as free text); choosing a suggestion links the catalogue medicine.
 */
export function MedicinePicker({
	id,
	value,
	linked,
	onTextChange,
	onPick,
	invalid,
}: {
	id: string;
	value: string;
	/** True when the current text came from a catalogue suggestion. */
	linked: boolean;
	onTextChange: (text: string) => void;
	onPick: (medicine: MedicineSuggestion) => void;
	invalid?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const wrapper = useRef<HTMLDivElement>(null);
	const term = useDebounced(value.trim(), 250);

	const suggestions = useQuery({
		queryKey: ["prescription-medicines", term],
		queryFn: () => searchMedicines(term),
		enabled: open && !linked && term.length >= 2,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		const close = (event: MouseEvent) => {
			if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, []);

	return (
		<div ref={wrapper} className="relative">
			<Input
				id={id}
				value={value}
				placeholder="Search brand or generic, for example Napa"
				autoComplete="off"
				aria-invalid={invalid}
				aria-expanded={open}
				aria-controls={`${id}-list`}
				onChange={(e) => {
					onTextChange(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
			/>
			{linked && <p className="mt-1 text-xs text-muted-foreground">From the medicine catalogue</p>}
			{open && !linked && term.length >= 2 && (
				<ul
					id={`${id}-list`}
					className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-popover shadow-md"
					aria-label="Matching medicines"
				>
					{suggestions.isLoading && <li className="p-3 text-sm text-muted-foreground">Searching...</li>}
					{suggestions.data?.length === 0 && (
						<li className="p-3 text-sm text-muted-foreground">Not in the catalogue. The text you typed will be used.</li>
					)}
					{suggestions.data?.map((m) => (
						<li key={m.id}>
							<button
								type="button"
								className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-accent"
								onClick={() => {
									onPick(m);
									setOpen(false);
								}}
							>
								<span className="font-medium">
									{m.brandName} {m.strength} {m.dosageForm ? `(${m.dosageForm})` : ""}
								</span>
								<span className="text-muted-foreground">
									{[m.generic, m.manufacturer].filter(Boolean).join(" · ")}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
