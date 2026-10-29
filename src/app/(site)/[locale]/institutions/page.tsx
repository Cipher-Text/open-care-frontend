import type { Metadata } from "next";
import { Suspense } from "react";
import InstitutionsDirectory from "@/components/institutions/InstitutionsDirectory";
import PageHero from "@/components/common/PageHero";
import { ListSkeleton } from "@/components/common/StateViews";

export const metadata: Metadata = {
	title: "Medical colleges and institutions | Open Care",
	description: "Browse medical colleges and health institutions in Bangladesh by district and ownership.",
};

export default function InstitutionsPage() {
	return (
		<div className="min-h-screen bg-muted/50">
			<PageHero
				title="Medical colleges and institutions"
				description="Browse government and private institutions by district."
			/>
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Suspense fallback={<ListSkeleton />}>
					<InstitutionsDirectory />
				</Suspense>
			</div>
		</div>
	);
}
