import type { Metadata } from "next";
import NextLink from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck, GraduationCap, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DetailSection, DetailShell } from "@/components/common/DetailShell";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";
import { localizedNames, placeName } from "@/lib/names";
import { nutritionistPath } from "@/lib/paths";
import { clean, getNutritionist, safeUrl } from "@/lib/public-directory";

export const revalidate = 600;

/** No page is built ahead of time: each one is rendered on first request, then cached and refreshed by `revalidate`. */
export function generateStaticParams() {
	return [];
}

type Props = { params: Promise<{ locale: Locale; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, id } = await params;
	const t = await getTranslations({ locale, namespace: "nutritionists" });
	const nutritionist = await getNutritionist(id).catch(() => null);
	if (!nutritionist) return { title: t("notFound") };
	const name = localizedNames(locale, nutritionist.profile.name, nutritionist.profile.bnName).primary;
	return { ...bilingual(locale, nutritionistPath(nutritionist)), title: `${name} | Open Care`, description: t("metaDetailFallback", { name }) };
}

/** The public page of one nutritionist or dietitian (the public profile only). While not verified it offers the claim. */
export default async function NutritionistDetailPage({ params }: Props) {
	const { locale, id } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("nutritionists");
	const common = await getTranslations("common");
	const nutritionist = await getNutritionist(id);
	if (!nutritionist) notFound();

	const { profile } = nutritionist;
	const names = localizedNames(locale, profile.name, profile.bnName);
	const image = safeUrl(profile.imageUrl ?? profile.photo);
	const location = [placeName(locale, profile.upazila), placeName(locale, profile.district)].map(clean).filter(Boolean).join(", ");

	return (
		<DetailShell backHref="/nutritionists" backLabel={t("back")}>
			<Card className="gap-0 py-0">
				<CardContent className="space-y-4 p-5 sm:p-8">
					<div className="flex gap-4 sm:gap-6">
						<div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-primary/10 text-primary sm:size-28">
							{image ? (
								<Image src={image} alt="" width={112} height={112} className="size-full object-cover" unoptimized />
							) : (
								<UserRound className="size-10 sm:size-14" aria-hidden="true" />
							)}
						</div>
						<div className="min-w-0 flex-1 space-y-2">
							<h1 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-2xl font-bold text-foreground sm:text-3xl">
								{names.primary || t("unnamed")}
								{nutritionist.isVerified && <BadgeCheck className="size-6 text-primary" aria-label={common("verified")} />}
							</h1>
							{names.secondary && (
								<p lang={names.secondaryLang} className="text-primary">
									{names.secondary}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">{t(`title.${nutritionist.title}`)}</Badge>
								{nutritionist.registrationNo && <Badge variant="outline">{t("registration", { number: nutritionist.registrationNo })}</Badge>}
								{nutritionist.yearOfExperience ? <Badge variant="secondary">{t("experience", { count: nutritionist.yearOfExperience })}</Badge> : null}
								{nutritionist.isVerified ? <Badge>{common("verifiedListing")}</Badge> : <Badge variant="outline">{common("notVerified")}</Badge>}
							</div>
							{location && (
								<p className="flex items-start gap-2 text-sm text-muted-foreground">
									<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
									{location}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{nutritionist.degrees && (
				<DetailSection title={t("qualifications")}>
					<p className="flex items-start gap-2 text-muted-foreground">
						<GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
						{nutritionist.degrees}
					</p>
				</DetailSection>
			)}

			{nutritionist.description && (
				<DetailSection title={t("about")}>
					<p className="whitespace-pre-line leading-relaxed text-muted-foreground">{nutritionist.description}</p>
				</DetailSection>
			)}

			<p className="text-sm text-muted-foreground">{t("notPhysician")}</p>

			{!nutritionist.isVerified && (
				<p className="text-sm text-muted-foreground">
					<NextLink href={`/account/verification/claim?nutritionist=${nutritionist.id}`} className="font-medium text-primary hover:underline">
						{t("claim")}
					</NextLink>{" "}
					{t("claimHint")}
				</p>
			)}
		</DetailShell>
	);
}
