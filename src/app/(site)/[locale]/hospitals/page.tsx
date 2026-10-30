import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListSkeleton } from "@/components/common/StateViews";
import HospitalsDirectory from "@/components/hospitals/HospitalsDirectory";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "hospitals" });
	return { title: t("metaListTitle"), description: t("metaListDescription"), ...bilingual(locale, "/hospitals") };
}

export default async function HospitalsPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("hospitals");

	return (
		<div className="min-h-screen bg-muted/50">
			<div className="bg-gradient-to-r from-primary to-primary/80 py-10 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
					<h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t("heroTitle")}</h1>
					<p className="text-base sm:text-lg">{t("heroSubtitle")}</p>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Suspense fallback={<ListSkeleton />}>
					<HospitalsDirectory />
				</Suspense>
			</div>
		</div>
	);
}
