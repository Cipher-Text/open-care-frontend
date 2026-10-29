"use client";

import { Suspense, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import HospitalFilters from "@/components/hospitals/HospitalFilters";
import HospitalsList from "@/components/hospitals/HospitalsList";
import { ListSkeleton } from "@/components/common/StateViews";

function HospitalsDirectory() {
	const [showFilters, setShowFilters] = useState(false);

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
			{/* Filters: collapsible on mobile, sidebar on desktop */}
			<aside className="w-full lg:w-80 lg:shrink-0">
				<Button
					type="button"
					variant="outline"
					className="h-12 w-full justify-between lg:hidden"
					aria-expanded={showFilters}
					aria-controls="hospital-filters"
					onClick={() => setShowFilters((v) => !v)}
				>
					<span className="flex items-center gap-2">
						<SlidersHorizontal className="size-4" aria-hidden="true" />
						Filters
					</span>
					<span className="text-sm text-muted-foreground">
						{showFilters ? "Hide" : "Show"}
					</span>
				</Button>
				<div
					id="hospital-filters"
					className={showFilters ? "mt-3 block lg:mt-0" : "hidden lg:block"}
				>
					<HospitalFilters />
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				<HospitalsList />
			</div>
		</div>
	);
}

export default function HospitalsPage() {
	return (
		<div className="min-h-screen bg-muted/50">
			<div className="bg-gradient-to-r from-primary to-primary/80 py-10 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
					<h1 className="mb-2 text-2xl font-bold sm:text-3xl">Find hospitals</h1>
					<p className="text-base sm:text-lg">
						Search and filter hospitals by location, type and organization
					</p>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Suspense fallback={<ListSkeleton />}>
					<HospitalsDirectory />
				</Suspense>
			</div>
		</div>
	);
}
