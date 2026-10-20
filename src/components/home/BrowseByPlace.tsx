import Link from "next/link";
import { MapPin } from "lucide-react";
import { HomeStats } from "@/lib/public-stats";

/** Divisions with their districts. Plain links, so it works without JavaScript and is crawlable. */
export default function BrowseByPlace({ stats }: { stats: HomeStats }) {
	if (stats.divisions.length === 0) return null;
	return (
		<section aria-labelledby="place-title" className="bg-muted/50 py-14 sm:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<h2 id="place-title" className="text-2xl font-bold text-foreground sm:text-3xl">
					Browse by division and district
				</h2>
				<p className="mt-1 mb-8 text-muted-foreground">Choose a district to see the facilities there.</p>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{stats.divisions.map((division) => (
						<details key={division.id} className="group rounded-xl border bg-card p-5 open:shadow-sm">
							<summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2">
								<span className="flex items-center gap-2 text-lg font-semibold text-foreground">
									<MapPin className="size-5 text-primary" aria-hidden="true" />
									{division.name}
								</span>
								<span className="text-sm text-muted-foreground">
									{division.districts.length} districts
									<span className="ml-2 inline-block transition-transform group-open:rotate-180" aria-hidden="true">
										⌄
									</span>
								</span>
							</summary>
							<ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
								{division.districts.map((d) => (
									<li key={d.id}>
										<Link
											href={`/hospitals?district=${d.id}`}
											className="block rounded px-1 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
										>
											{d.name}
										</Link>
									</li>
								))}
							</ul>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
