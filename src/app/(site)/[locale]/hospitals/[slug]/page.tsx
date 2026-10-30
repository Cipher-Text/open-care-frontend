import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
	Ambulance,
	BadgeCheck,
	Bed,
	Building2,
	Droplets,
	Globe,
	Mail,
	MapPin,
	Navigation,
	Phone,
	Siren,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailSection, DetailShell, Fact } from "@/components/common/DetailShell";
import { JsonLd } from "@/components/common/JsonLd";
import { PublicEventTracker } from "@/components/common/PublicEventTracker";
import { Link, redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";
import { formatNumber } from "@/lib/format";
import { enumName, localizedNames, placeName } from "@/lib/names";
import { clean, getHospital, safeUrl, validEmail } from "@/lib/public-directory";
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
	const t = await getTranslations({ locale, namespace: "hospitals" });
	const hospital = await getHospital(slug).catch(() => null);
	if (!hospital) return { title: t("notFound") };
	const name = localizedNames(locale, hospital.name, hospital.bnName).primary;
	const place = [placeName(locale, hospital.upazila), placeName(locale, hospital.district)].filter(Boolean).join(", ");
	return {
		...bilingual(locale, hospitalPath(hospital)),
		openGraph: { type: "website", title: `${name} | Open Care`, url: hospitalPath(hospital) },
		title: `${name} | Open Care`,
		description: t("metaDetailDescription", { name, place: place ? `, ${place}` : "" }),
	};
}

export default async function HospitalDetailPage({ params }: Props) {
	const { locale, slug } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("hospitals");
	const common = await getTranslations("common");
	const hospital = await getHospital(slug);
	if (!hospital) notFound();
	// Old id-based links (and a renamed slug) land on the canonical slug URL, in the same language.
	if (hospital.slug && hospital.slug !== decodeURIComponent(slug)) redirect({ href: hospitalPath(hospital), locale });

	const names = localizedNames(locale, hospital.name, hospital.bnName);
	const hospitalType = enumName(locale, hospital.hospitalType);
	const organizationType = enumName(locale, hospital.organizationType);

	const website = safeUrl(hospital.websiteUrl);
	const facebook = safeUrl(hospital.facebookPageUrl);
	const email = validEmail(hospital.email);
	const phone = clean(hospital.phone);
	const location = [hospital.address, placeName(locale, hospital.union), placeName(locale, hospital.upazila), placeName(locale, hospital.district)]
		.map(clean)
		.filter(Boolean)
		.join(", ");
	const hasCoords = hospital.lat != null && hospital.lon != null && hospital.lat !== "" && hospital.lon !== "";
	const directions = hasCoords
		? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.lat},${hospital.lon}`)}`
		: location
			? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name} ${location}`)}`
			: null;
	const doctors = (hospital.doctors ?? []).filter((d) => d?.profile?.name);
	const tests = (hospital.tests ?? []).filter((t) => t.isActive !== false);
	const amenities = (hospital.amenities ?? []).filter((a) => a.isActive !== false);

	return (
		<DetailShell backHref="/hospitals" backLabel={t("back")}>
			{hospital.slug && <PublicEventTracker kind="HOSPITAL" slug={hospital.slug} />}
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Hospital",
					name: names.primary,
					...(names.secondary && { alternateName: names.secondary }),
					inLanguage: locale,
					url: `${siteUrl}${locale === "bn" ? "/bn" : ""}${hospitalPath(hospital)}`,
					...(phone && { telephone: phone }),
					...(email && { email }),
					...(website && { sameAs: [website] }),
					...(location && {
						address: { "@type": "PostalAddress", streetAddress: location, addressCountry: "BD" },
					}),
					...(hasCoords && {
						geo: { "@type": "GeoCoordinates", latitude: Number(hospital.lat), longitude: Number(hospital.lon) },
					}),
				}}
			/>
			<Card className="gap-0 py-0">
				<CardContent className="space-y-5 p-5 sm:p-8">
					<div className="flex gap-4">
						<div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10 text-primary sm:size-20">
							<Building2 className="size-8 sm:size-10" aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<h1 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
								{names.primary}
								{hospital.isVerified && (
									<BadgeCheck className="size-6 text-primary" aria-label={common("verified")} />
								)}
							</h1>
							{names.secondary && (
								<p lang={names.secondaryLang} className="mt-1 text-primary">
									{names.secondary}
								</p>
							)}
							<div className="mt-3 flex flex-wrap gap-2">
								{hospitalType && <Badge variant="secondary">{hospitalType}</Badge>}
								{organizationType && <Badge variant="outline">{organizationType}</Badge>}
								{hospital.isVerified ? (
									<Badge>{common("verifiedListing")}</Badge>
								) : (
									<Badge variant="outline">{common("notVerified")}</Badge>
								)}
							</div>
						</div>
					</div>

					{(hospital.hasEmergencyService || hospital.hasAmbulanceService || hospital.hasBloodBank) && (
						<div className="flex flex-wrap gap-2 text-sm">
							{hospital.hasEmergencyService && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Siren className="size-3.5" aria-hidden="true" /> {common("emergency")}
								</span>
							)}
							{hospital.hasAmbulanceService && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Ambulance className="size-3.5" aria-hidden="true" /> {common("ambulance")}
								</span>
							)}
							{hospital.hasBloodBank && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Droplets className="size-3.5" aria-hidden="true" /> {common("bloodBank")}
								</span>
							)}
						</div>
					)}

					<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
						{phone && (
							<Button asChild className="h-11">
								<a href={`tel:${phone.replace(/\s+/g, "")}`} data-track-event="CALL">
									<Phone className="mr-2 size-4" aria-hidden="true" />
									{t("callPhone", { phone })}
								</a>
							</Button>
						)}
						{email && (
							<Button asChild variant="outline" className="h-11">
								<a href={`mailto:${email}`}>
									<Mail className="mr-2 size-4" aria-hidden="true" />
									{common("email")}
								</a>
							</Button>
						)}
						{website && (
							<Button asChild variant="outline" className="h-11">
								<a href={website} target="_blank" rel="noopener noreferrer">
									<Globe className="mr-2 size-4" aria-hidden="true" />
									{common("website")}
								</a>
							</Button>
						)}
						{directions && (
							<Button asChild variant="outline" className="h-11">
								<a href={directions} target="_blank" rel="noopener noreferrer" data-track-event="DIRECTIONS">
									<Navigation className="mr-2 size-4" aria-hidden="true" />
									{common("directions")}
								</a>
							</Button>
						)}
					</div>
					{!phone && !email && !website && (
						<p className="text-sm text-muted-foreground">
							{t("noContact")}
						</p>
					)}
				</CardContent>
			</Card>

			<DetailSection title={t("about")}>
				<dl className="grid gap-4 sm:grid-cols-2">
					{location && (
						<Fact
							label={t("location")}
							value={
								<span className="flex items-start gap-1.5">
									<MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
									{location}
								</span>
							}
						/>
					)}
					{clean(placeName(locale, hospital.district?.division)) && <Fact label={t("division")} value={clean(placeName(locale, hospital.district?.division))} />}
					{hospital.numberOfBed > 0 && (
						<Fact
							label={t("bedsLabel")}
							value={
								<span className="flex items-center gap-1.5">
									<Bed className="size-4 text-muted-foreground" aria-hidden="true" />
									{formatNumber(hospital.numberOfBed, locale)}
								</span>
							}
						/>
					)}
					{hospital.registrationCode && <Fact label={t("registrationCode")} value={hospital.registrationCode} />}
					{facebook && (
						<Fact
							label={t("facebook")}
							value={
								<a href={facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									{t("facebookPage")}
								</a>
							}
						/>
					)}
				</dl>
			</DetailSection>

			{doctors.length > 0 && (
				<DetailSection title={t("doctors", { count: doctors.length })}>
					<ul className="divide-y">
						{doctors.map((doctor) => (
							<li key={doctor.id} className="py-2">
								<Link href={doctorPath(doctor)} className="font-medium text-primary hover:underline">
									{doctor.profile.name}
								</Link>
								{doctor.specializations && (
									<span className="ml-2 text-sm text-muted-foreground">{doctor.specializations}</span>
								)}
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{tests.length > 0 && (
				<DetailSection title={t("tests")}>
					<ul className="divide-y">
						{tests.map((test) => (
							<li key={test.id} className="flex items-baseline justify-between gap-3 py-2 text-sm">
								<span className="text-foreground">{test.name || test.medicalTest?.name}</span>
								{test.price > 0 && (
									<span className="shrink-0 text-muted-foreground">{t("price", { price: test.price })}</span>
								)}
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{amenities.length > 0 && (
				<DetailSection title={t("amenities")}>
					<ul className="grid gap-2 sm:grid-cols-2">
						{amenities.map((amenity) => (
							<li key={amenity.id} className="flex items-baseline justify-between gap-3 text-sm">
								<span className="text-foreground">{amenity.name}</span>
								<span className="shrink-0 text-muted-foreground">
									{t("available", { available: amenity.available, quantity: amenity.quantity })}
								</span>
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{!hospital.isVerified && (
				<p className="text-sm text-muted-foreground">
					<NextLink href={`/account/verification/claim?hospital=${hospital.id}`} className="font-medium text-primary hover:underline">
						{t("claim")}
					</NextLink>{" "}
					{t("claimHint")}
				</p>
			)}

			<p className="text-xs text-muted-foreground">{common("notMedicalAdvice")}</p>
		</DetailShell>
	);
}
