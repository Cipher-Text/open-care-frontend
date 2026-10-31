import type { Metadata } from "next";
import NextLink from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck, Globe, GraduationCap, MapPin, Phone, Stethoscope, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailSection, DetailShell } from "@/components/common/DetailShell";
import { JsonLd } from "@/components/common/JsonLd";
import { PublicEventTracker } from "@/components/common/PublicEventTracker";
import { DoctorReviews } from "@/components/reviews/DoctorReviews";
import { Link, redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";
import { localizedNames, placeName } from "@/lib/names";
import { clean, getDoctor, safeUrl } from "@/lib/public-directory";
import { siteUrl } from "@/lib/site";
import { doctorPath, hospitalPath } from "@/lib/paths";

export const revalidate = 600;

/** No page is built ahead of time: each one is rendered on first request, then cached and refreshed by `revalidate`. */
export function generateStaticParams() {
	return [];
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params;
	const t = await getTranslations({ locale, namespace: "doctors" });
	const doctor = await getDoctor(slug).catch(() => null);
	if (!doctor) return { title: t("notFound") };
	const name = localizedNames(locale, doctor.profile.name, doctor.profile.bnName).primary;
	return {
		...bilingual(locale, doctorPath(doctor)),
		openGraph: { type: "profile", title: `${name} | Open Care`, url: doctorPath(doctor) },
		title: `${name} | Open Care`,
		description: [doctor.specializations, doctor.degrees].filter(Boolean).join(". ") || t("metaDetailFallback", { name }),
	};
}

/** The year of a stored date, in Bangla digits under /bn and without a thousands separator. */
function year(date: string | null | undefined, locale: string) {
	return date ? new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", { useGrouping: false }).format(Number(date.slice(0, 4))) : null;
}

export default async function DoctorDetailPage({ params }: Props) {
	const { locale, slug } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("doctors");
	const common = await getTranslations("common");
	const doctor = await getDoctor(slug);
	if (!doctor) notFound();
	// Old id-based links (and a renamed slug) land on the canonical slug URL, in the same language.
	if (doctor.slug && doctor.slug !== decodeURIComponent(slug)) redirect({ href: doctorPath(doctor), locale });

	const period = (start?: string | null, end?: string | null) => {
		const from = year(start, locale);
		const to = year(end, locale);
		if (!from && !to) return null;
		return t("periodRange", { from: from ?? t("periodUnknown"), to: to ?? t("periodPresent") });
	};

	const { profile } = doctor;
	const image = safeUrl((profile as { imageUrl?: string | null }).imageUrl ?? profile.photo);
	const names = localizedNames(locale, profile.name, profile.bnName);
	const location = [placeName(locale, profile.upazila), placeName(locale, profile.district)].map(clean).filter(Boolean).join(", ");
	// The API returns a phone only when the doctor chose to show it
	const phone = typeof profile.phone === "string" ? profile.phone.trim() : "";
	const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
	const links = [
		{ label: common("website"), url: safeUrl((profile as { websiteUrl?: string | null }).websiteUrl) },
		{ label: "LinkedIn", url: safeUrl(profile.linkedinProfileUrl) },
		{ label: "Facebook", url: safeUrl(profile.facebookProfileUrl) },
		{ label: "ResearchGate", url: safeUrl(profile.researchGateProfileUrl) },
		{ label: "X", url: safeUrl(profile.xprofileUrl) },
	].filter((l): l is { label: string; url: string } => l.url != null);

	const degrees = doctor.doctorDegrees ?? [];
	const workplaces = (doctor.doctorWorkplaces ?? []).filter((w) => w.hospital || w.institution);
	const associations = (doctor.doctorAssociations ?? []).filter((a) => a.association);

	return (
		<DetailShell backHref="/doctors" backLabel={t("back")}>
			{doctor.slug && <PublicEventTracker kind="DOCTOR" slug={doctor.slug} />}
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Physician",
					name: names.primary,
						...(names.secondary && { alternateName: names.secondary }),
						inLanguage: locale,
						url: `${siteUrl}${locale === "bn" ? "/bn" : ""}${doctorPath(doctor)}`,
					...(doctor.specializations && { medicalSpecialty: doctor.specializations }),
					...(image && { image }),
					...(links.length > 0 && { sameAs: links.map((l) => l.url) }),
					...(location && { address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "BD" } }),
				}}
			/>
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
						<div className="min-w-0 space-y-2">
							<h1 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
									{names.primary}
									{doctor.isVerified && <BadgeCheck className="size-6 text-primary" aria-label={common("verified")} />}
								</h1>
								{names.secondary && (
									<p lang={names.secondaryLang} className="text-primary">
										{names.secondary}
									</p>
								)}
							<div className="flex flex-wrap gap-2">
								<Badge variant="outline">{t("bmdc", { number: doctor.bmdcNo })}</Badge>
								{doctor.yearOfExperience ? (
									<Badge variant="secondary">{t("experience", { count: doctor.yearOfExperience })}</Badge>
								) : null}
								{doctor.isVerified ? <Badge>{common("verifiedListing")}</Badge> : <Badge variant="outline">{common("notVerified")}</Badge>}
							</div>
							<ul className="space-y-1.5 text-sm text-muted-foreground">
								{doctor.specializations && (
									<li className="flex items-start gap-2">
										<Stethoscope className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
										{doctor.specializations}
									</li>
								)}
								{doctor.degrees && (
									<li className="flex items-start gap-2">
										<GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
										{doctor.degrees}
									</li>
								)}
								{location && (
									<li className="flex items-start gap-2">
										<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
										{location}
									</li>
								)}
							</ul>
						</div>
					</div>
					{phoneHref && (
						<div className="flex flex-wrap gap-2">
							<Button asChild className="h-10">
								<a href={phoneHref}>
									<Phone className="mr-2 size-4" aria-hidden="true" />
									{t("callPhone", { phone })}
</a>
							</Button>
						</div>
					)}
					{doctor.isVerified && (
						<div className="flex flex-wrap items-center gap-2">
							<Button asChild variant="outline" className="h-10">
								<NextLink href={`/account/book?doctor=${doctor.id}`}>{t("bookVisit")}</NextLink>
							</Button>
							<span className="text-xs text-muted-foreground">{t("bookHint")}</span>
						</div>
					)}
					{links.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{links.map((link) => (
								<Button key={link.label} asChild variant="outline" className="h-10">
									<a href={link.url} target="_blank" rel="noopener noreferrer">
										<Globe className="mr-2 size-4" aria-hidden="true" />
										{link.label}
									</a>
								</Button>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{doctor.description && (
				<DetailSection title={t("about")}>
					<p className="whitespace-pre-line leading-relaxed text-muted-foreground">{doctor.description}</p>
				</DetailSection>
			)}

			{workplaces.length > 0 && (
				<DetailSection title={t("practise")}>
					<ul className="divide-y">
						{workplaces.map((w) => {
							const place = w.hospital ?? w.institution;
							const href = w.hospital ? hospitalPath(w.hospital) : null;
							const dates = period(w.startDate, w.endDate);
							return (
								<li key={w.id} className="space-y-0.5 py-2">
									<p className="font-medium text-foreground">
										{href ? (
											<Link href={href} className="text-primary hover:underline">
												{place?.name}
											</Link>
										) : (
											place?.name
										)}
									</p>
									<p className="text-sm text-muted-foreground">
										{[w.doctorPosition, w.teacherPosition, w.medicalSpeciality?.name].filter(Boolean).join(" · ")}
										{dates ? ` · ${dates}` : ""}
									</p>
								</li>
							);
						})}
					</ul>
				</DetailSection>
			)}

			{degrees.length > 0 && (
				<DetailSection title={t("education")}>
					<ul className="divide-y">
						{degrees.map((d) => {
							const dates = period(d.startDate, d.endDate);
							return (
								<li key={d.id} className="space-y-0.5 py-2">
									<p className="font-medium text-foreground">
										{d.degree?.abbreviation ? `${d.degree.abbreviation}, ` : ""}
										{d.degree?.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{[d.institution?.name, d.medicalSpeciality?.name, d.grade].filter(Boolean).join(" · ")}
										{dates ? ` · ${dates}` : ""}
									</p>
								</li>
							);
						})}
					</ul>
				</DetailSection>
			)}

			{associations.length > 0 && (
				<DetailSection title={t("associations")}>
					<ul className="divide-y">
						{associations.map((a) => (
							<li key={a.id} className="py-2 text-sm">
								<span className="font-medium text-foreground">
									{a.association.name}
									{a.association.shortName ? ` (${a.association.shortName})` : ""}
								</span>
								{(a as { membershipType?: { displayName?: string | null } }).membershipType?.displayName && (
									<span className="ml-2 text-muted-foreground">
										{(a as { membershipType?: { displayName?: string | null } }).membershipType?.displayName}
									</span>
								)}
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{doctor.id != null && <DoctorReviews doctorId={doctor.id} />}

			<p className="text-xs text-muted-foreground">{common("notMedicalAdvice")}</p>
		</DetailShell>
	);
}
