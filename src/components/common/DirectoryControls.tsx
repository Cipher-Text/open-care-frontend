"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ALL } from "@/hooks/use-url-params";

/** Text input that writes to the URL after the user stops typing. */
export function DebouncedSearch({
	value,
	onChange,
	label,
	placeholder,
}: {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder: string;
}) {
	const [text, setText] = useState(value);

	// Keep in sync when the URL changes elsewhere (clear filters, back button)
	useEffect(() => setText(value), [value]);

	useEffect(() => {
		if (text === value) return;
		const t = setTimeout(() => onChange(text.trim()), 400);
		return () => clearTimeout(t);
	}, [text, value, onChange]);

	return (
		<div className="relative">
			<Search
				className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				type="search"
				aria-label={label}
				placeholder={placeholder}
				value={text}
				onChange={(e) => setText(e.target.value)}
				className="h-11 pl-10"
			/>
		</div>
	);
}

export interface Option {
	value: string;
	label: string;
}

export function FilterSelect({
	label,
	value,
	onChange,
	options,
	allLabel,
	disabled,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: Option[];
	allLabel: string;
	disabled?: boolean;
}) {
	return (
		<Select
			value={value || ALL}
			onValueChange={onChange}
			disabled={disabled}
		>
			<SelectTrigger aria-label={label} className="h-11 w-full">
				<SelectValue placeholder={allLabel} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>{allLabel}</SelectItem>
				{options.map((o) => (
					<SelectItem key={o.value} value={o.value}>
						{o.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function DirectoryPagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;
	return (
		<nav
			aria-label="Pagination"
			className="flex items-center justify-between gap-3"
		>
			<Button
				variant="outline"
				className="h-11"
				disabled={page <= 1}
				onClick={() => onPageChange(page - 1)}
			>
				<ChevronLeft className="mr-1 size-4" aria-hidden="true" />
				Previous
			</Button>
			<span className="text-sm text-muted-foreground" aria-live="polite">
				Page {page.toLocaleString()} of {totalPages.toLocaleString()}
			</span>
			<Button
				variant="outline"
				className="h-11"
				disabled={page >= totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Next
				<ChevronRight className="ml-1 size-4" aria-hidden="true" />
			</Button>
		</nav>
	);
}
