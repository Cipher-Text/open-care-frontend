import {
	Ambulance,
	BadgeCheck,
	Bed,
	Building2,
	Droplets,
	Globe,
	Mail,
	MapPin,
	Phone,
	Siren,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Hospital } from "@/types/hospitals";
import { hospitalPath } from "@/lib/paths";

function safeUrl(url?: string | null) {
	if (!url) return null;
	const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
	try {
		return new URL(withProtocol).toString();
	} catch {
		return null;
	}
}

export default function HospitalCard({ hospital }: { hospital: Hospital }) {
	const website = safeUrl(hospital.websiteUrl);
	const phone = hospital.phone?.trim();
	// Email is the contact detail most listings have; ignore malformed values
	const email = hospital.email?.trim();
	const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
	const location = [hospital.address, hospital.upazila?.name, hospital.district?.name]
		.filter(Boolean)
		.join(", ");

	return (
		<Card className="relative h-full gap-0 py-0 transition-colors hover:border-primary/50">
			<CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
				<div className="flex gap-4">
					<div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-primary bg-primary/10 text-primary">
						<Building2 className="size-7" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h3 className="flex flex-wrap items-center gap-x-2 text-lg font-bold leading-snug text-foreground">
							<Link
								href={hospitalPath(hospital)}
								className="hover:text-primary hover:underline after:absolute after:inset-0"
							>
								{hospital.name}
							</Link>
							{hospital.isVerified && (
								<BadgeCheck
									className="size-5 text-primary"
									aria-label="Verified"
								/>
							)}
						</h3>
						{hospital.bnName && (
							<p lang="bn" className="text-sm text-primary">
								{hospital.bnName}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{hospital.hospitalType?.englishName && (
						<Badge variant="secondary">{hospital.hospitalType.englishName}</Badge>
					)}
					{hospital.organizationType?.displayName && (
						<Badge variant="outline">{hospital.organizationType.displayName}</Badge>
					)}
				</div>

				<ul className="space-y-1.5 text-sm text-muted-foreground">
					{location && (
						<li className="flex items-start gap-2">
							<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							<span>{location}</span>
						</li>
					)}
					{hospital.numberOfBed > 0 && (
						<li className="flex items-center gap-2">
							<Bed className="size-4 shrink-0" aria-hidden="true" />
							{hospital.numberOfBed.toLocaleString()} beds
						</li>
					)}
				</ul>

				{(hospital.hasEmergencyService ||
					hospital.hasAmbulanceService ||
					hospital.hasBloodBank) && (
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

				{(phone || validEmail || website) && (
					<div className="relative z-10 mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
						{phone && (
							<Button asChild className="h-11">
								<a href={`tel:${phone.replace(/\s+/g, "")}`}>
									<Phone className="mr-2 size-4" aria-hidden="true" />
									Call
								</a>
							</Button>
						)}
						{validEmail && (
							<Button asChild variant="outline" className="h-11">
								<a href={`mailto:${validEmail}`} aria-label={`Email ${hospital.name}`}>
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
					</div>
				)}
			</CardContent>
		</Card>
	);
}
