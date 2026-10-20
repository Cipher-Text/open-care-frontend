"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Target = "hospitals" | "doctors";

/** One search box for both directories. Sends the visitor to the list page with filters set. */
export default function HeroSearch({ districts }: { districts: { id: number; name: string }[] }) {
	const router = useRouter();
	const [target, setTarget] = useState<Target>("hospitals");
	const [query, setQuery] = useState("");
	const [district, setDistrict] = useState("");

	const submit = (e: FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (query.trim()) params.set("q", query.trim());
		if (district) params.set("district", district);
		const qs = params.toString();
		router.push(`/${target}${qs ? `?${qs}` : ""}`);
	};

	return (
		<form onSubmit={submit} role="search" aria-label="Search health facilities and doctors" className="mx-auto mt-8 max-w-3xl">
			<div role="radiogroup" aria-label="What are you looking for?" className="mb-3 flex justify-center gap-2">
				{(["hospitals", "doctors"] as Target[]).map((t) => (
					<button
						key={t}
						type="button"
						role="radio"
						aria-checked={target === t}
						onClick={() => setTarget(t)}
						className={cn(
							"min-h-10 rounded-full border px-5 text-sm font-medium transition-colors",
							target === t
								? "border-primary bg-primary text-primary-foreground"
								: "border-input bg-background text-foreground hover:bg-accent"
						)}
					>
						{t === "hospitals" ? "Hospitals and clinics" : "Doctors"}
					</button>
				))}
			</div>

			<div className="flex flex-col gap-3 rounded-2xl border bg-background p-3 shadow-sm sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
					<Input
						type="search"
						aria-label={target === "doctors" ? "Doctor name" : "Facility name"}
						placeholder={target === "doctors" ? "Doctor name" : "Hospital or clinic name"}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="h-12 border-0 pl-10 text-base shadow-none focus-visible:ring-0"
					/>
				</div>
				<label className="sr-only" htmlFor="hero-district">
					District
				</label>
				<select
					id="hero-district"
					value={district}
					onChange={(e) => setDistrict(e.target.value)}
					className="h-12 rounded-md border border-input bg-background px-3 text-base sm:w-52"
				>
					<option value="">All districts</option>
					{districts.map((d) => (
						<option key={d.id} value={d.id}>
							{d.name}
						</option>
					))}
				</select>
				<Button type="submit" size="lg" className="h-12 px-8">
					Search
				</Button>
			</div>
		</form>
	);
}
