import type { Bilingual as BilingualText } from "@/lib/consent-text";

/** One text in English and, under it, in Bangla (`lang="bn"` so screen readers and fonts treat it right). */
export function Bilingual({ text, className }: { text: BilingualText; className?: string }) {
	return (
		<span className={className}>
			<span className="block">{text.en}</span>
			<span lang="bn" className="mt-0.5 block text-[0.95em] opacity-90">
				{text.bn}
			</span>
		</span>
	);
}
