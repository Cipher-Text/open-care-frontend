import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
	const t = await getTranslations("footer");
	return (
		<footer className="bg-foreground py-12 text-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<h3 className="mb-2 text-xl font-bold">Open Care</h3>
						<p className="text-sm opacity-80">{t("about")}</p>
					</div>

					<nav aria-label={t("directory")}>
						<h4 className="mb-3 font-bold">{t("directory")}</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li><Link href="/hospitals" className="hover:underline">{t("hospitals")}</Link></li>
							<li><Link href="/doctors" className="hover:underline">{t("doctors")}</Link></li>
							<li><Link href="/ambulances" className="hover:underline">{t("ambulances")}</Link></li>
							<li><Link href="/hospitals?type=BLOOD_BANK" className="hover:underline">{t("bloodBanks")}</Link></li>
							<li><Link href="/institutions" className="hover:underline">{t("institutions")}</Link></li>
						</ul>
					</nav>

					<nav aria-label={t("aboutAndLegal")}>
						<h4 className="mb-3 font-bold">Open Care</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li><Link href="/blog" className="hover:underline">{t("articles")}</Link></li>
							<li><Link href="/about" className="hover:underline">{t("aboutUs")}</Link></li>
							<li><Link href="/pricing" className="hover:underline">{t("pricing")}</Link></li>
							<li><Link href="/contact" className="hover:underline">{t("contact")}</Link></li>
							<li><NextLink href="/signup" className="hover:underline">{t("professionals")}</NextLink></li>
							<li><Link href="/medical-review-policy" className="hover:underline">{t("reviewPolicy")}</Link></li>
							<li><Link href="/privacy" className="hover:underline">{t("privacy")}</Link></li>
							<li><Link href="/terms" className="hover:underline">{t("terms")}</Link></li>
							<li>
								<a href="https://hub.opencarebd.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
									{t("hub")}
								</a>
							</li>
						</ul>
					</nav>

					<div>
						<h4 className="mb-3 font-bold">{t("contactTitle")}</h4>
						<p className="text-sm opacity-80">
							<a href="mailto:hello@opencarebd.com" className="hover:underline">
								hello@opencarebd.com
							</a>
						</p>
						<p className="mt-1 text-sm opacity-80">{t("city")}</p>
						<p className="mt-4 text-sm font-medium">
							{t("emergency")}{" "}
							<a href="tel:999" className="underline">
								999
							</a>
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-background/20 pt-6 text-center text-sm opacity-80">
					© {new Date().getFullYear()} {t("copyright")}
				</div>
			</div>
		</footer>
	);
}
