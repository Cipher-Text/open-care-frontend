import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { localizedNames, placeName } from "@/lib/names";
import { nursePath } from "@/lib/paths";
import type { NurseResponse } from "@/types/nurses";

export default function NurseCard({ nurse }: { nurse: NurseResponse }) {
	const t = useTranslations("nurses");
	const common = useTranslations("common");
	const locale = useLocale();
	const { profile } = nurse;
	const names = localizedNames(locale, profile?.name, profile?.bnName);
	const location = [placeName(locale, profile?.upazila), placeName(locale, profile?.district)].filter(Boolean).join(", ");
	const image = profile?.imageUrl || profile?.photo;

	return (
		<Card className="relative gap-0 py-0 transition-colors hover:border-primary/50">
			<CardContent className="flex gap-4 p-5 sm:p-6">
				<div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-primary/10 text-primary sm:size-20">
					{image ? (
						<Image src={image} alt="" width={80} height={80} className="size-full object-cover" unoptimized />
					) : (
						<UserRound className="size-8 sm:size-10" aria-hidden="true" />
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-2">
					<div>
						<h3 lang={names.primaryLang} className="flex flex-wrap items-center gap-x-2 text-lg font-bold leading-snug text-foreground sm:text-xl">
							<Link href={nursePath(nurse)} className="hover:text-primary hover:underline after:absolute after:inset-0">
								{names.primary || t("unnamed")}
							</Link>
							{nurse.isVerified && <BadgeCheck className="size-5 text-primary" aria-label={common("verified")} />}
						</h3>
						{names.secondary && (
							<p lang={names.secondaryLang} className="text-sm text-primary">
								{names.secondary}
							</p>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						{nurse.bnmcNo && <Badge variant="outline">{t("bnmc", { number: nurse.bnmcNo })}</Badge>}
						{nurse.yearOfExperience ? <Badge variant="secondary">{t("experience", { count: nurse.yearOfExperience })}</Badge> : null}
					</div>

					{location && (
						<ul className="space-y-1.5 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
								{location}
							</li>
						</ul>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
