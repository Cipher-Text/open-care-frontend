import { CalendarDays, Globe, GraduationCap, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicInstitution } from "@/api/directory";

function safeUrl(url?: string | null) {
	if (!url) return null;
	const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
	try {
		return new URL(withProtocol).toString();
	} catch {
		return null;
	}
}

export default function InstitutionCard({ institution }: { institution: PublicInstitution }) {
	const website = safeUrl(institution.websiteUrl);
	const place = [institution.upazila?.name, institution.district?.name].filter(Boolean).join(", ");

	return (
		<Card className="h-full gap-0 py-0">
			<CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-primary bg-primary/10 text-primary">
						<GraduationCap className="size-7" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h3 className="text-lg font-bold leading-snug text-foreground">
							{institution.name}
							{institution.acronym && (
								<span className="ml-2 text-sm font-medium text-muted-foreground">({institution.acronym})</span>
							)}
						</h3>
						{institution.bnName && (
							<p lang="bn" className="text-sm text-primary">
								{institution.bnName}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{institution.institutionType?.englishName && (
						<Badge variant="secondary">{institution.institutionType.englishName}</Badge>
					)}
					{institution.organizationType?.displayName && (
						<Badge variant="outline">{institution.organizationType.displayName}</Badge>
					)}
				</div>

				<ul className="space-y-1.5 text-sm text-muted-foreground">
					{place && (
						<li className="flex items-start gap-2">
							<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							{place}
						</li>
					)}
					{institution.establishedYear && (
						<li className="flex items-center gap-2">
							<CalendarDays className="size-4 shrink-0" aria-hidden="true" />
							Established {institution.establishedYear}
						</li>
					)}
					{institution.enroll ? (
						<li className="flex items-center gap-2">
							<Users className="size-4 shrink-0" aria-hidden="true" />
							{institution.enroll.toLocaleString()} students enrolled per year
						</li>
					) : null}
				</ul>

				{website && (
					<Button asChild variant="outline" className="mt-auto h-11">
						<a href={website} target="_blank" rel="noopener noreferrer">
							<Globe className="mr-2 size-4" aria-hidden="true" />
							Website
						</a>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
