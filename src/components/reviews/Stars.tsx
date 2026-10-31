/** Five stars for a whole number 1 to 5, with a text label for screen readers. */
/** `label` replaces the English screen-reader text, for pages shown in another language. */
export function Stars({ value, className = "", label }: { value: number; className?: string; label?: string }) {
	const filled = Math.max(0, Math.min(5, Math.round(value)));
	return (
		<span className={`inline-flex text-amber-500 ${className}`} role="img" aria-label={label ?? `${filled} out of 5 stars`}>
			{"★".repeat(filled)}
			<span className="text-muted-foreground/40">{"★".repeat(5 - filled)}</span>
		</span>
	);
}
