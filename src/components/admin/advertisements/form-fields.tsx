"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

/** Label, control and error text wired together for screen readers. */
export function Field({
	id,
	label,
	required,
	error,
	hint,
	children,
}: {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	hint?: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label htmlFor={id}>
				{label}
				{required && <span className="text-destructive"> *</span>}
			</Label>
			{children}
			{hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
			{error && (
				<p id={`${id}-error`} role="alert" className="text-xs text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}

/** Select over {value,label} options. `optional` adds a "None" choice that maps to "". */
export function OptionSelect({
	id,
	value,
	onChange,
	options,
	placeholder,
	optional,
	disabled,
	invalid,
}: {
	id: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder: string;
	optional?: boolean;
	disabled?: boolean;
	invalid?: boolean;
}) {
	return (
		<Select
			value={value === "" ? (optional ? NONE : "") : value}
			onValueChange={(v) => onChange(v === NONE ? "" : v)}
			disabled={disabled}
		>
			<SelectTrigger id={id} className="w-full" aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{optional && <SelectItem value={NONE}>None</SelectItem>}
				{options.map((o) => (
					<SelectItem key={o.value} value={o.value}>
						{o.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
