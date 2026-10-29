import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "../../globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ClientProviders } from "@/components/common/ClientProviders";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { isLocale, routing } from "@/i18n/routing";
import { fontClassName } from "@/lib/fonts";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta" });
	// A page that has no Bangla version yet shows English text under /bn: keep it out of search. Pages that are
	// translated set their own robots and alternates (see i18n/seo.ts).
	return { title: t("title"), description: t("description"), ...(locale === "bn" ? { robots: { index: false, follow: true } } : {}) };
}

/** Root layout of the public pages: the language comes from the URL (English unprefixed, Bangla under /bn). */
export default async function SiteLayout({ children, params }: Props) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	// Reads no cookie or header, so the public pages stay statically cached
	setRequestLocale(locale);

	return (
		<html lang={locale}>
			<body className={fontClassName}>
				<NextIntlClientProvider>
					<ClientProviders>
						<GoogleAnalytics />
						<Header />
						<main id="main-content">{children}</main>
						<Footer />
						<Toaster />
					</ClientProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
