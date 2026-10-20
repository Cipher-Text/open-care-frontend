import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import AmbulancesDirectory from "@/components/ambulances/AmbulancesDirectory";
import PageHero from "@/components/common/PageHero";
import { ListSkeleton } from "@/components/common/StateViews";

export const metadata: Metadata = {
	title: "Ambulance services | Open Care",
	description: "Find ambulances by district and type, with a phone number to call.",
};

export default function AmbulancesPage() {
	return (
		<div className="min-h-screen bg-muted/50">
			<PageHero title="Ambulance services" description="Find an ambulance near you and call the driver directly." />
			<div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div role="note" className="flex flex-col gap-3 rounded-xl border border-emergency/30 bg-emergency/10 p-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-foreground">
						<strong className="text-emergency">In an emergency, call 999 first.</strong> This list is still small and
						covers only some districts, so a nearby ambulance may not be listed.
					</p>
					<a
						href="tel:999"
						className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-emergency px-5 font-semibold text-emergency-foreground hover:opacity-90"
					>
						<Phone className="size-4" aria-hidden="true" />
						Call 999
					</a>
				</div>
				<Suspense fallback={<ListSkeleton />}>
					<AmbulancesDirectory />
				</Suspense>
			</div>
		</div>
	);
}
