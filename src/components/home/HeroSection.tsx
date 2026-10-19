import Link from "next/link";
import { Search, Stethoscope, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroSection() {
	return (
		<section className="bg-gradient-to-br from-primary/10 to-accent py-12 sm:py-20">
			<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
					Find doctors and hospitals <span className="text-primary">across Bangladesh</span>
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
					Search a directory of doctors and hospitals by specialty, location and
					type.
				</p>

				<form
					action="/doctors"
					method="get"
					role="search"
					className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
				>
					<div className="relative flex-1">
						<Search
							className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
							aria-hidden="true"
						/>
						<Input
							name="q"
							type="search"
							aria-label="Search doctors, specialties or hospitals"
							placeholder="Search doctors or hospitals"
							className="h-12 rounded-full border-2 border-primary bg-background pl-12 text-base"
						/>
					</div>
					<Button type="submit" size="lg" className="h-12 rounded-full px-8">
						Search
					</Button>
				</form>

				<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
					<Button asChild size="lg" variant="outline" className="h-12">
						<Link href="/doctors">
							<Stethoscope className="mr-2 size-4" aria-hidden="true" />
							Browse doctors
						</Link>
					</Button>
					<Button asChild size="lg" variant="outline" className="h-12">
						<Link href="/hospitals">
							<Building2 className="mr-2 size-4" aria-hidden="true" />
							Browse hospitals
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
