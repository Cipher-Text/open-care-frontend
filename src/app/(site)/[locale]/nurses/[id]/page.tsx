import type { Metadata } from "next";
import NextLink from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DetailSection, DetailShell } from "@/components/common/DetailShell";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";
import { localizedNames, placeName } from "@/lib/names";
import { hospitalPath, nursePath } from "@/lib/paths";
import { Link } from "@/i18n/navigation";
import { clean, getNurse, getNurseWorkplaces, safeUrl } from "@/lib/public-directory";

export const revalidate = 600;

/** No page is built ahead of time: each one is rendered on first request, then cached and refreshed by `revalidate`. */
export function generateStaticParams() {
	return [];
}

type Props = { params: Promise<{ locale: Locale; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, id } = await params;
	const t = await getTranslations({ locale, namespace: "nurses" });
	const nurse = await getNurse(id).catch(() => null);
	if (!nurse) return { title: t("notFound") };
	const name = localizedNames(locale, nurse.profile.name, nurse.profile.bnName).primary;
	return {
		...bilingual(locale, nursePath(nurse)),
		title: `${name} | Open Care`,
		description: t("metaDetailFallback", { name }),
	};
}

/** The public page of one nurse (the public profile only). While the nurse is not verified it offers the claim. */
export default async function NurseDetailPage({ params }: Props) {
	const { locale, id } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("nurses");
	const common = await getTranslations("common");
	const nurse = await getNurse(id);
	if (!nurse) notFound();
	// where they work: only links the nurse chose to show
	const workplaces = await getNurseWorkplaces(nurse.id);

	const { profile } = nurse;
	const names = localizedNames(locale, profile.name, profile.bnName);
	const image = safeUrl(profile.imageUrl ?? profile.photo);
	const location = [placeName(locale, profile.upazila), placeName(locale, profile.district)].map(clean).filter(Boolean).join(", ");

	return (
		<DetailShell backHref="/nurses" backLabel={t("back")}>
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
								{nurse.isVerified && <BadgeCheck className="size-6 text-primary" aria-label={common("verified")} />}
							</h1>
							{names.secondary && (
								<p lang={names.secondaryLang} className="text-primary">
									{names.secondary}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								{nurse.bnmcNo && <Badge variant="outline">{t("bnmc", { number: nurse.bnmcNo })}</Badge>}
								{nurse.yearOfExperience ? <Badge variant="secondary">{t("experience", { count: nurse.yearOfExperience })}</Badge> : null}
								{nurse.isVerified ? <Badge>{common("verifiedListing")}</Badge> : <Badge variant="outline">{common("notVerified")}</Badge>}
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

			{workplaces.length > 0 && (
				<DetailSection title={t("worksAt")}>
					<ul className="divide-y">
						{workplaces.map((w) => (
							<li key={`${w.hospitalId}-${w.personId}`} className="py-2">
								<Link href={hospitalPath({ id: w.hospitalId, slug: w.hospitalSlug })} className="font-medium text-primary hover:underline">
									{localizedNames(locale, w.hospitalName, w.hospitalBnName).primary}
								</Link>
								{w.position && <span className="ml-2 text-sm text-muted-foreground">{w.position}</span>}
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{nurse.description && (
				<DetailSection title={t("about")}>
					<p className="whitespace-pre-line leading-relaxed text-muted-foreground">{nurse.description}</p>
				</DetailSection>
			)}

			{!nurse.isVerified && (
				<p className="text-sm text-muted-foreground">
					<NextLink href={`/account/verification/claim?nurse=${nurse.id}`} className="font-medium text-primary hover:underline">
						{t("claim")}
					</NextLink>{" "}
					{t("claimHint")}
				</p>
			)}
		</DetailShell>
	);
}
