"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import HospitalFilters from "@/components/hospitals/HospitalFilters";
import HospitalsList from "@/components/hospitals/HospitalsList";

/** The filter sidebar and the results. A client component: the filters live in the page address. */
export default function HospitalsDirectory() {
	const t = useTranslations("hospitals");
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
						{t("filters")}
					</span>
					<span className="text-sm text-muted-foreground">{showFilters ? t("hide") : t("show")}</span>
				</Button>
				<div id="hospital-filters" className={showFilters ? "mt-3 block lg:mt-0" : "hidden lg:block"}>
					<HospitalFilters />
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				<HospitalsList />
			</div>
		</div>
	);
}
