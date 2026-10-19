import Image from "next/image";
import { BadgeCheck, GraduationCap, MapPin, Stethoscope, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorResponse } from "@/types/doctors";

export default function DoctorCard({ doctor }: { doctor: DoctorResponse }) {
	const { profile } = doctor;
	const name = profile?.name || "Unnamed doctor";
	const bnName = profile?.bnName && profile.bnName !== name ? profile.bnName : null;
	const location = [profile?.upazila?.name, profile?.district?.name]
		.filter(Boolean)
		.join(", ");
	const image = profile?.imageUrl || profile?.photo;

	return (
		<Card className="gap-0 py-0">
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
						<h3 className="flex flex-wrap items-center gap-x-2 text-lg font-bold leading-snug text-foreground sm:text-xl">
							{name}
							{doctor.isVerified && (
								<BadgeCheck className="size-5 text-primary" aria-label="Verified" />
							)}
						</h3>
						{bnName && (
							<p lang="bn" className="text-sm text-primary">
								{bnName}
							</p>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						<Badge variant="outline">BMDC {doctor.bmdcNo}</Badge>
						{doctor.yearOfExperience ? (
							<Badge variant="secondary">
								{doctor.yearOfExperience} years experience
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
