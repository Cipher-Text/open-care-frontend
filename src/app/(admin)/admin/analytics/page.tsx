import { AdminHeader } from "@/components/admin/admin-header";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { AnalyticsStats } from "@/components/admin/analytics-stats";

export default function AnalyticsPage() {
	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Analytics & Reports"
				description="Comprehensive analytics for your healthcare facility"
			/>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<AnalyticsStats />
				<AnalyticsCharts />
			</div>
		</div>
	);
}
