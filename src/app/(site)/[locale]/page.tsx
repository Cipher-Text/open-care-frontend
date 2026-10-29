import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BrowseByPlace from "@/components/home/BrowseByPlace";
import EmergencyStrip from "@/components/home/EmergencyStrip";
import FacilityTypes from "@/components/home/FacilityTypes";
import FaqSection, { FAQ_KEYS } from "@/components/home/FaqSection";
import ForProfessionals from "@/components/home/ForProfessionals";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import { bilingual } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";
import { getHomeStats } from "@/lib/public-stats";

// Rebuilt at most once an hour; the numbers come from the API on the server
export const revalidate = 3600;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "home" });
	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
		...bilingual(locale, ""),
		openGraph: {
			title: t("metaTitle"),
			description: t("ogDescription"),
			type: "website",
			locale: locale === "bn" ? "bn_BD" : "en_BD",
		},
	};
}

export default async function Home({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const [stats, t] = await Promise.all([getHomeStats(locale), getTranslations("home")]);

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Open Care",
			description: t("siteDescription"),
			inLanguage: locale,
		},
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			inLanguage: locale,
			mainEntity: FAQ_KEYS.map((key) => ({
				"@type": "Question",
				name: t(`faq.${key}.q`),
				acceptedAnswer: { "@type": "Answer", text: t(`faq.${key}.a`) },
			})),
		},
	];

	return (
		<div className="bg-background">
			<HeroSection stats={stats} />
			<EmergencyStrip />
			<FacilityTypes stats={stats} />
			<BrowseByPlace stats={stats} />
			<TrustSection />
			<ForProfessionals />
			<FaqSection />
			<script
				type="application/ld+json"
				// Server-built JSON from the message files (no user input)
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</div>
	);
}
