import { Ambulance, Building2, MapPin, Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicAmbulance } from "@/api/directory";

export default function AmbulanceCard({ ambulance }: { ambulance: PublicAmbulance }) {
	const phone = ambulance.driverPhone?.replace(/[\s()-]/g, "");
	const place = [ambulance.upazila?.name, ambulance.district?.name].filter(Boolean).join(", ");

	return (
		<Card className="h-full gap-0 py-0">
			<CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-emergency bg-emergency/10 text-emergency">
						<Ambulance className="size-7" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h3 className="text-lg font-bold leading-snug text-foreground">
							{ambulance.type?.description ?? "Ambulance"}
						</h3>
						<p className="text-sm text-muted-foreground">Vehicle {ambulance.vehicleNumber}</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge
						variant="outline"
						className={ambulance.isAvailable ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}
					>
						{ambulance.isAvailable ? "Available" : "Not available now"}
					</Badge>
					{ambulance.isAffiliated && <Badge variant="secondary">Hospital affiliated</Badge>}
				</div>

				<ul className="space-y-1.5 text-sm text-muted-foreground">
					{place && (
						<li className="flex items-start gap-2">
							<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							{place}
						</li>
					)}
					{ambulance.hospital?.name && (
						<li className="flex items-start gap-2">
							<Building2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							{ambulance.hospital.name}
						</li>
					)}
					{ambulance.driverName && (
						<li className="flex items-center gap-2">
							<UserRound className="size-4 shrink-0" aria-hidden="true" />
							Driver: {ambulance.driverName}
						</li>
					)}
				</ul>

				{phone && (
					<Button asChild className="mt-auto h-12 bg-emergency text-emergency-foreground hover:bg-emergency/90">
						<a href={`tel:${phone}`}>
							<Phone className="mr-2 size-5" aria-hidden="true" />
							Call {ambulance.driverPhone}
						</a>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
