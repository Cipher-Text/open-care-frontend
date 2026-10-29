import { useTranslations } from "next-intl";
import { AlertTriangle, BadgeCheck, Flag } from "lucide-react";

const CONTACT = "hello@opencarebd.com";

/** Plain statements about what the directory is and is not. Only things that are true today. */
export default function TrustSection() {
	const t = useTranslations("home.trust");
	const items = [
		{ icon: AlertTriangle, title: t("info.title"), text: t("info.text") },
		{ icon: BadgeCheck, title: t("verified.title"), text: t("verified.text") },
		{
			icon: Flag,
			title: t("fix.title"),
			text: t("fix.text"),
			action: { href: `mailto:${CONTACT}?subject=${encodeURIComponent(t("fix.subject"))}`, label: t("fix.action") },
		},
	];

	return (
		<section aria-labelledby="trust-title" className="py-14 sm:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<h2 id="trust-title" className="text-2xl font-bold text-foreground sm:text-3xl">
					{t("title")}
				</h2>
				<div className="mt-8 grid gap-6 md:grid-cols-3">
					{items.map(({ icon: Icon, title, text, action }) => (
						<div key={title} className="rounded-xl border bg-card p-6">
							<Icon className="mb-3 size-7 text-primary" aria-hidden="true" />
							<h3 className="text-lg font-semibold text-foreground">{title}</h3>
							<p className="mt-2 text-muted-foreground">{text}</p>
							{action && (
								<a href={action.href} className="mt-4 inline-block font-medium text-primary hover:underline">
									{action.label}
								</a>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
