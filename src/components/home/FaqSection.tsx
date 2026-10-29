import { useTranslations } from "next-intl";

/** Keys of home.faq in the message files, in display order. */
export const FAQ_KEYS = ["what", "verified", "booking", "report", "advice"] as const;

export default function FaqSection() {
	const t = useTranslations("home.faq");
	return (
		<section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-14 sm:py-16">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h2 id="faq-title" className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
					{t("title")}
				</h2>
				<div className="divide-y rounded-xl border bg-card">
					{FAQ_KEYS.map((key) => (
						<details key={key} className="group px-5 py-4">
							<summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground">
								{t(`${key}.q`)}
								<span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">
									⌄
								</span>
							</summary>
							<p className="mt-2 text-muted-foreground">{t(`${key}.a`)}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
