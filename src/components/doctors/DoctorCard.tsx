import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, GraduationCap, MapPin, Stethoscope, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorResponse } from "@/types/doctors";
import { Link } from "@/i18n/navigation";
import { localizedNames, placeName } from "@/lib/names";
import { doctorPath } from "@/lib/paths";

export default function DoctorCard({ doctor }: { doctor: DoctorResponse }) {
	const t = useTranslations("doctors");
	const common = useTranslations("common");
	const locale = useLocale();
	const { profile } = doctor;
	const names = localizedNames(locale, profile?.name, profile?.bnName);
	const location = [placeName(locale, profile?.upazila), placeName(locale, profile?.district)]
		.filter(Boolean)
		.join(", ");
	const image = profile?.imageUrl || profile?.photo;

	return (
		<Card className="relative gap-0 py-0 transition-colors hover:border-primary/50">
			<CardContent className="flex gap-4 p-5 sm:p-6">
				<div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-primary/10 text-primary sm:size-20">
					{image ? (
						<Image
							src={image}
							alt=""
							width={80}
							height={80}
							className="size-full object-cover"
							unoptimized
						/>
					) : (
						<UserRound className="size-8 sm:size-10" aria-hidden="true" />
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-2">
					<div>
						<h3 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-lg font-bold leading-snug text-foreground sm:text-xl">
							<Link
								href={doctorPath(doctor)}
								className="hover:text-primary hover:underline after:absolute after:inset-0"
							>
								{names.primary || t("unnamed")}
							</Link>
							{doctor.isVerified && (
								<BadgeCheck className="size-5 text-primary" aria-label={common("verified")} />
							)}
						</h3>
						{names.secondary && (
							<p lang={names.secondaryLang} className="text-sm text-primary">
								{names.secondary}
							</p>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						<Badge variant="outline">{t("bmdc", { number: doctor.bmdcNo })}</Badge>
						{doctor.yearOfExperience ? (
							<Badge variant="secondary">
								{t("experience", { count: doctor.yearOfExperience })}
							</Badge>
						) : null}
					</div>

					<ul className="space-y-1.5 text-sm text-muted-foreground">
						{doctor.degrees && (
							<li className="flex items-start gap-2">
								<GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
								{doctor.degrees}
							</li>
						)}
						{doctor.specializations && (
							<li className="flex items-start gap-2">
								<Stethoscope className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
								{doctor.specializations}
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
			</CardContent>
		</Card>
	);
}
