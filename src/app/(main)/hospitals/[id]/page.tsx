import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { DetailSection, DetailShell, Fact, NOT_MEDICAL_ADVICE } from "@/components/common/DetailShell";
import { getHospital, safeUrl, validEmail } from "@/lib/public-directory";

export const revalidate = 600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const hospital = await getHospital(id).catch(() => null);
	if (!hospital) return { title: "Hospital not found | Open Care" };
	const place = [hospital.upazila?.name, hospital.district?.name].filter(Boolean).join(", ");
	return {
		title: `${hospital.name} | Open Care`,
		description: `${hospital.name}${place ? `, ${place}` : ""}. Contact details, services and doctors on Open Care.`,
	};
}

export default async function HospitalDetailPage({ params }: Props) {
	const { id } = await params;
	const hospital = await getHospital(id);
	if (!hospital) notFound();

	const website = safeUrl(hospital.websiteUrl);
	const facebook = safeUrl(hospital.facebookPageUrl);
	const email = validEmail(hospital.email);
	const phone = hospital.phone?.trim();
	const location = [hospital.address, hospital.union?.name, hospital.upazila?.name, hospital.district?.name]
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
		<DetailShell backHref="/hospitals" backLabel="All hospitals">
			<Card className="gap-0 py-0">
				<CardContent className="space-y-5 p-5 sm:p-8">
					<div className="flex gap-4">
						<div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10 text-primary sm:size-20">
							<Building2 className="size-8 sm:size-10" aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<h1 className="flex flex-wrap items-center gap-x-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
								{hospital.name}
								{hospital.isVerified && (
									<BadgeCheck className="size-6 text-primary" aria-label="Verified" />
								)}
							</h1>
							{hospital.bnName && hospital.bnName !== hospital.name && (
								<p lang="bn" className="mt-1 text-primary">
									{hospital.bnName}
								</p>
							)}
							<div className="mt-3 flex flex-wrap gap-2">
								{hospital.hospitalType?.englishName && (
									<Badge variant="secondary">{hospital.hospitalType.englishName}</Badge>
								)}
								{hospital.organizationType?.displayName && (
									<Badge variant="outline">{hospital.organizationType.displayName}</Badge>
								)}
								{hospital.isVerified ? (
									<Badge>Verified listing</Badge>
								) : (
									<Badge variant="outline">Not yet verified</Badge>
								)}
							</div>
						</div>
					</div>

					{(hospital.hasEmergencyService || hospital.hasAmbulanceService || hospital.hasBloodBank) && (
						<div className="flex flex-wrap gap-2 text-sm">
							{hospital.hasEmergencyService && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Siren className="size-3.5" aria-hidden="true" /> Emergency
								</span>
							)}
							{hospital.hasAmbulanceService && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Ambulance className="size-3.5" aria-hidden="true" /> Ambulance
								</span>
							)}
							{hospital.hasBloodBank && (
								<span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2.5 py-1 text-emergency">
									<Droplets className="size-3.5" aria-hidden="true" /> Blood bank
								</span>
							)}
						</div>
					)}

					<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
						{phone && (
							<Button asChild className="h-11">
								<a href={`tel:${phone.replace(/\s+/g, "")}`}>
									<Phone className="mr-2 size-4" aria-hidden="true" />
									Call {phone}
								</a>
							</Button>
						)}
						{email && (
							<Button asChild variant="outline" className="h-11">
								<a href={`mailto:${email}`}>
									<Mail className="mr-2 size-4" aria-hidden="true" />
									Email
								</a>
							</Button>
						)}
						{website && (
							<Button asChild variant="outline" className="h-11">
								<a href={website} target="_blank" rel="noopener noreferrer">
									<Globe className="mr-2 size-4" aria-hidden="true" />
									Website
								</a>
							</Button>
						)}
						{directions && (
							<Button asChild variant="outline" className="h-11">
								<a href={directions} target="_blank" rel="noopener noreferrer">
									<Navigation className="mr-2 size-4" aria-hidden="true" />
									Directions
								</a>
							</Button>
						)}
					</div>
					{!phone && !email && !website && (
						<p className="text-sm text-muted-foreground">
							No contact details are listed for this facility yet.
						</p>
					)}
				</CardContent>
			</Card>

			<DetailSection title="About this facility">
				<dl className="grid gap-4 sm:grid-cols-2">
					{location && (
						<Fact
							label="Location"
							value={
								<span className="flex items-start gap-1.5">
									<MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
									{location}
								</span>
							}
						/>
					)}
					{hospital.district?.division?.name && <Fact label="Division" value={hospital.district.division.name} />}
					{hospital.numberOfBed > 0 && (
						<Fact
							label="Beds"
							value={
								<span className="flex items-center gap-1.5">
									<Bed className="size-4 text-muted-foreground" aria-hidden="true" />
									{hospital.numberOfBed.toLocaleString()}
								</span>
							}
						/>
					)}
					{hospital.registrationCode && <Fact label="Registration code" value={hospital.registrationCode} />}
					{facebook && (
						<Fact
							label="Facebook"
							value={
								<a href={facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Facebook page
								</a>
							}
						/>
					)}
				</dl>
			</DetailSection>

			{doctors.length > 0 && (
				<DetailSection title={`Doctors (${doctors.length})`}>
					<ul className="divide-y">
						{doctors.map((doctor) => (
							<li key={doctor.id} className="py-2">
								<Link href={`/doctors/${doctor.id}`} className="font-medium text-primary hover:underline">
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
				<DetailSection title="Tests and services">
					<ul className="divide-y">
						{tests.map((test) => (
							<li key={test.id} className="flex items-baseline justify-between gap-3 py-2 text-sm">
								<span className="text-foreground">{test.name || test.medicalTest?.name}</span>
								{test.price > 0 && (
									<span className="shrink-0 text-muted-foreground">BDT {test.price.toLocaleString()}</span>
								)}
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			{amenities.length > 0 && (
				<DetailSection title="Amenities">
					<ul className="grid gap-2 sm:grid-cols-2">
						{amenities.map((amenity) => (
							<li key={amenity.id} className="flex items-baseline justify-between gap-3 text-sm">
								<span className="text-foreground">{amenity.name}</span>
								<span className="shrink-0 text-muted-foreground">
									{amenity.available}/{amenity.quantity} available
								</span>
							</li>
						))}
					</ul>
				</DetailSection>
			)}

			<p className="text-xs text-muted-foreground">{NOT_MEDICAL_ADVICE}</p>
		</DetailShell>
	);
}
