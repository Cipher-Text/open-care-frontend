import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Calendar } from "lucide-react";

const analyticsStats = [
	{
		title: "Patient Satisfaction",
		value: "94.2%",
		change: "+2.1%",
		trend: "up",
		icon: TrendingUp,
		description: "Based on 1,234 reviews this month",
	},
	{
		title: "Average Wait Time",
		value: "12 min",
		change: "-3 min",
		trend: "down",
		icon: TrendingDown,
		description: "15% improvement from last month",
	},
	{
		title: "Staff Utilization",
		value: "87%",
		change: "+5%",
		trend: "up",
		icon: Activity,
		description: "Optimal utilization target: 85-90%",
	},
	{
		title: "Appointment Rate",
		value: "89%",
		change: "+7%",
		trend: "up",
		icon: Calendar,
		description: "Show rate has improved significantly",
	},
];

const departmentStats = [
	{ name: "Cardiology", patients: 245, capacity: 300, utilization: 82 },
	{ name: "Emergency", patients: 189, capacity: 200, utilization: 95 },
	{ name: "Pediatrics", patients: 156, capacity: 180, utilization: 87 },
	{ name: "Neurology", patients: 98, capacity: 120, utilization: 82 },
	{ name: "Orthopedics", patients: 134, capacity: 150, utilization: 89 },
];

export function AnalyticsStats() {
	return (
		<div className="space-y-4">
			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{analyticsStats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon
								className={`h-4 w-4 ${
									stat.trend === "up" ? "text-green-600" : "text-red-600"
								}`}
							/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p
								className={`text-xs ${
									stat.trend === "up" ? "text-green-600" : "text-red-600"
								}`}
							>
								{stat.change} from last month
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Department Utilization */}
			<Card>
				<CardHeader>
					<CardTitle>Department Utilization</CardTitle>
					<CardDescription>
						Current patient capacity across all departments
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{departmentStats.map((dept, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="font-medium">{dept.name}</div>
									<div className="text-sm text-muted-foreground">
										{dept.patients}/{dept.capacity} patients ({dept.utilization}
										%)
									</div>
								</div>
								<Progress value={dept.utilization} className="h-2" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
