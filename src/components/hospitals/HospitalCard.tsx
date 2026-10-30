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
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { enumName, localizedNames, placeName } from "@/lib/names";
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
	const t = useTranslations("hospitals");
	const common = useTranslations("common");
	const locale = useLocale();
	const names = localizedNames(locale, hospital.name, hospital.bnName);
	const website = safeUrl(hospital.websiteUrl);
	const phone = hospital.phone?.trim();
	// Email is the contact detail most listings have; ignore malformed values
	const email = hospital.email?.trim();
	const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
	const location = [hospital.address, placeName(locale, hospital.upazila), placeName(locale, hospital.district)]
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
						<h3 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-lg font-bold leading-snug text-foreground">
							<Link
								href={hospitalPath(hospital)}
								className="hover:text-primary hover:underline after:absolute after:inset-0"
							>
								{names.primary}
							</Link>
							{hospital.isVerified && (
								<BadgeCheck
									className="size-5 text-primary"
									aria-label={common("verified")}
								/>
							)}
						</h3>
						{names.secondary && (
							<p lang={names.secondaryLang} className="text-sm text-primary">
								{names.secondary}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{enumName(locale, hospital.hospitalType) && (
						<Badge variant="secondary">{enumName(locale, hospital.hospitalType)}</Badge>
					)}
					{enumName(locale, hospital.organizationType) && (
						<Badge variant="outline">{enumName(locale, hospital.organizationType)}</Badge>
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
							{t("beds", { count: hospital.numberOfBed })}
						</li>
					)}
				</ul>

				{(hospital.hasEmergencyService ||
					hospital.hasAmbulanceService ||
					hospital.hasBloodBank) && (
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

				{(phone || validEmail || website) && (
					<div className="relative z-10 mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
						{phone && (
							<Button asChild className="h-11">
								<a href={`tel:${phone.replace(/\s+/g, "")}`}>
									<Phone className="mr-2 size-4" aria-hidden="true" />
									{common("call")}
								</a>
							</Button>
						)}
						{validEmail && (
							<Button asChild variant="outline" className="h-11">
								<a href={`mailto:${validEmail}`} aria-label={t("emailAria", { name: names.primary })}>
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
					</div>
				)}
			</CardContent>
		</Card>
	);
}
