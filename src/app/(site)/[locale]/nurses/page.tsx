import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListSkeleton } from "@/components/common/StateViews";
import NurseFilters from "@/components/nurses/NurseFilters";
import NursesList from "@/components/nurses/NursesList";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "nurses" });
	return { title: t("metaListTitle"), description: t("metaListDescription"), ...bilingual(locale, "/nurses") };
}

/** Find a nurse by name and district. It is also where a nurse finds their own listing to claim it. */
export default async function NursesPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("nurses");

	return (
		<div className="min-h-screen bg-muted/50">
			<div className="bg-gradient-to-r from-primary to-primary/80 py-10 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
					<h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t("heroTitle")}</h1>
					<p className="text-base sm:text-lg">{t("heroSubtitle")}</p>
				</div>
			</div>

			<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				<Suspense fallback={<ListSkeleton />}>
					<NurseFilters />
					<NursesList />
				</Suspense>
			</div>
		</div>
	);
}
