import HeroSearch from "@/components/home/HeroSearch";
import { HomeStats, formatCount } from "@/lib/public-stats";

export default function HeroSection({ stats }: { stats: HomeStats }) {
	const facts = [
		stats.facilities != null && { value: formatCount(stats.facilities), label: "health facilities" },
		stats.doctors != null && { value: formatCount(stats.doctors), label: "doctors" },
		stats.upazilas != null && { value: formatCount(stats.upazilas), label: "upazilas covered" },
		stats.districts != null && { value: formatCount(stats.districts), label: "districts" },
	].filter(Boolean) as { value: string; label: string }[];

	return (
		<section aria-labelledby="hero-title" className="bg-gradient-to-b from-primary/10 to-background py-12 sm:py-20">
			<div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
				<p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
					Bangladesh health directory
				</p>
				<h1 id="hero-title" className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
					Find the right care, <span className="text-primary">close to home</span>
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
					Search hospitals, clinics, diagnostic centers, blood banks and doctors in every district of
					Bangladesh.
				</p>

				<HeroSearch districts={stats.districtList} />

				{facts.length > 0 && (
					<dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
						{facts.map((f) => (
							<div key={f.label}>
								<dt className="sr-only">{f.label}</dt>
								<dd className="text-2xl font-bold text-foreground sm:text-3xl" aria-label={`${f.value} ${f.label}`}>
									{f.value}
									<span className="mt-1 block text-sm font-normal text-muted-foreground" aria-hidden="true">
										{f.label}
									</span>
								</dd>
							</div>
						))}
					</dl>
				)}
			</div>
		</section>
	);
}
