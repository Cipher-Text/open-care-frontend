import { Suspense } from "react";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorsList from "@/components/doctors/DoctorsList";
import { ListSkeleton } from "@/components/common/StateViews";

export default function DoctorsPage() {
	return (
		<div className="min-h-screen bg-muted/50">
			<div className="bg-gradient-to-r from-primary to-primary/80 py-10 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
					<h1 className="mb-2 text-2xl font-bold sm:text-3xl">Find a doctor</h1>
					<p className="text-base sm:text-lg">
						Search doctors by name, specialty and district
					</p>
				</div>
			</div>

			<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				<Suspense fallback={<ListSkeleton />}>
					<DoctorFilters />
					<DoctorsList />
				</Suspense>
			</div>
		</div>
	);
}
