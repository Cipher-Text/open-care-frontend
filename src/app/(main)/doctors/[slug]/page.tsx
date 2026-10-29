import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BadgeCheck, Globe, GraduationCap, MapPin, Stethoscope, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailSection, DetailShell, NOT_MEDICAL_ADVICE } from "@/components/common/DetailShell";
import { JsonLd } from "@/components/common/JsonLd";
import { PublicEventTracker } from "@/components/common/PublicEventTracker";
import { clean, getDoctor, safeUrl } from "@/lib/public-directory";
import { siteUrl } from "@/lib/site";
import { doctorPath, hospitalPath } from "@/lib/paths";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const doctor = await getDoctor(slug).catch(() => null);
	if (!doctor) return { title: "Doctor not found | Open Care" };
	return {
		alternates: { canonical: doctorPath(doctor) },
		openGraph: { type: "profile", title: `${doctor.profile.name} | Open Care`, url: doctorPath(doctor) },
		title: `${doctor.profile.name} | Open Care`,
		description: [doctor.specializations, doctor.degrees].filter(Boolean).join(". ") || `${doctor.profile.name} on Open Care.`,
	};
}

function year(date?: string | null) {
	return date ? date.slice(0, 4) : null;
}

function period(start?: string | null, end?: string | null) {
	const from = year(start);
	const to = year(end);
	if (!from && !to) return null;
	return `${from ?? "?"} to ${to ?? "present"}`;
}

export default async function DoctorDetailPage({ params }: Props) {
	const { slug } = await params;
	const doctor = await getDoctor(slug);
	if (!doctor) notFound();
	// Old id-based links (and a renamed slug) land on the canonical slug URL.
	if (doctor.slug && doctor.slug !== decodeURIComponent(slug)) permanentRedirect(doctorPath(doctor));

	const { profile } = doctor;
	const image = safeUrl((profile as { imageUrl?: string | null }).imageUrl ?? profile.photo);
	const bnName = profile.bnName && profile.bnName !== profile.name ? profile.bnName : null;
	const location = [profile.upazila?.name, profile.district?.name].map(clean).filter(Boolean).join(", ");
	const links = [
		{ label: "Website", url: safeUrl((profile as { websiteUrl?: string | null }).websiteUrl) },
		{ label: "LinkedIn", url: safeUrl(profile.linkedinProfileUrl) },
		{ label: "Facebook", url: safeUrl(profile.facebookProfileUrl) },
		{ label: "ResearchGate", url: safeUrl(profile.researchGateProfileUrl) },
		{ label: "X", url: safeUrl(profile.xprofileUrl) },
	].filter((l): l is { label: string; url: string } => l.url != null);

	const degrees = doctor.doctorDegrees ?? [];
	const workplaces = (doctor.doctorWorkplaces ?? []).filter((w) => w.hospital || w.institution);
	const associations = (doctor.doctorAssociations ?? []).filter((a) => a.association);

	return (
		<DetailShell backHref="/doctors" backLabel="All doctors">
			{doctor.slug && <PublicEventTracker kind="DOCTOR" slug={doctor.slug} />}
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Physician",
					name: profile.name,
					url: `${siteUrl}${doctorPath(doctor)}`,
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
							<h1 className="flex flex-wrap items-center gap-x-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
								{profile.name}
								{doctor.isVerified && <BadgeCheck className="size-6 text-primary" aria-label="Verified" />}
							</h1>
							{bnName && (
								<p lang="bn" className="text-primary">
									{bnName}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								<Badge variant="outline">BMDC {doctor.bmdcNo}</Badge>
								{doctor.yearOfExperience ? (
									<Badge variant="secondary">{doctor.yearOfExperience} years experience</Badge>
								) : null}
								{doctor.isVerified ? <Badge>Verified listing</Badge> : <Badge variant="outline">Not yet verified</Badge>}
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
				<DetailSection title="About">
					<p className="whitespace-pre-line leading-relaxed text-muted-foreground">{doctor.description}</p>
				</DetailSection>
			)}

			{workplaces.length > 0 && (
				<DetailSection title="Where they practise">
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
				<DetailSection title="Education and training">
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
				<DetailSection title="Associations">
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

			<p className="text-xs text-muted-foreground">{NOT_MEDICAL_ADVICE}</p>
		</DetailShell>
	);
}
