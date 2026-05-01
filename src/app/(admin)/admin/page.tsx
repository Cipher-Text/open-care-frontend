import { AdminHeader } from "@/components/admin/admin-header";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentActivity } from "@/components/admin/recent-activity";
import { OverviewChart } from "@/components/admin/overview-chart";

export default function AdminDashboard() {
	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Dashboard"
				description="Welcome to your admin dashboard overview"
			/>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<StatsCards />

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<OverviewChart />
					<RecentActivity />
				</div>
			</div>
		</div>
	);
}
