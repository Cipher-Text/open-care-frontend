/** Five stars for a whole number 1 to 5, with a text label for screen readers. */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
	const filled = Math.max(0, Math.min(5, Math.round(value)));
	return (
		<span className={`inline-flex text-amber-500 ${className}`} role="img" aria-label={`${filled} out of 5 stars`}>
			{"★".repeat(filled)}
			<span className="text-muted-foreground/40">{"★".repeat(5 - filled)}</span>
		</span>
	);
}
