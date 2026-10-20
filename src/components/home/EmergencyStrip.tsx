import Link from "next/link";
import { Droplets, Phone } from "lucide-react";

/** Always-visible emergency help right under the hero. Phone buttons work on mobile. */
export default function EmergencyStrip() {
	return (
		<section aria-label="Emergency help" className="border-y border-emergency/30 bg-emergency/10">
			<div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
				<p className="text-center font-medium text-foreground sm:text-left">
					<span className="text-emergency">In an emergency</span>, call the national emergency number right away.
				</p>
				<div className="flex flex-col gap-2 sm:flex-row">
					<a
						href="tel:999"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emergency px-6 font-semibold text-emergency-foreground hover:opacity-90"
					>
						<Phone className="size-5" aria-hidden="true" />
						Call 999
					</a>
					<Link
						href="/hospitals?type=BLOOD_BANK"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-emergency px-6 font-semibold text-emergency hover:bg-emergency/10"
					>
						<Droplets className="size-5" aria-hidden="true" />
						Find a blood bank
					</Link>
				</div>
			</div>
		</section>
	);
}
