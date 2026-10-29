import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HomeStats, formatCount } from "@/lib/public-stats";

/** Tiles that open the hospital list already filtered to a facility type, with real counts. */
export default function FacilityTypes({ stats }: { stats: HomeStats }) {
	const t = useTranslations("home.types");
	const locale = useLocale();
	if (stats.types.length === 0) return null;
	return (
		<section aria-labelledby="types-title" className="py-14 sm:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8 flex flex-wrap items-end justify-between gap-3">
					<div>
						<h2 id="types-title" className="text-2xl font-bold text-foreground sm:text-3xl">
							{t("title")}
						</h2>
						<p className="mt-1 text-muted-foreground">{t("lead")}</p>
					</div>
					<Link href="/hospitals" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
						{t("all")} <ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>

				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{stats.types.map((type) => (
						<li key={type.value}>
							<Link
								href={`/hospitals?type=${encodeURIComponent(type.value)}`}
								className="group flex h-full flex-col justify-between rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
							>
								<span className="text-lg font-semibold text-foreground">{t(`names.${type.label}`)}</span>
								<span className="mt-4 flex items-end justify-between">
									{type.count != null ? (
										<span className="text-3xl font-bold text-primary">{formatCount(type.count, locale)}</span>
									) : (
										<span />
									)}
									<span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
										{t("view")} <ArrowRight className="size-4" aria-hidden="true" />
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
