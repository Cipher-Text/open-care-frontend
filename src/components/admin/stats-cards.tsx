import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Building2, Stethoscope } from "lucide-react";

const stats = [
	{
		title: "Total Doctors",
		value: "342",
		description: "+12% from last month",
		icon: Stethoscope,
		trend: "up",
	},
	{
		title: "Total Hospitals",
		value: "156",
		description: "+8% from last month",
		icon: Building2,
		trend: "up",
	},
	{
		title: "Active Users",
		value: "2,847",
		description: "+15% from last month",
		icon: Users,
		trend: "up",
	},
	{
		title: "Daily Activities",
		value: "1,234",
		description: "+2.1% from yesterday",
		icon: Activity,
		trend: "up",
	},
];

export function StatsCards() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, index) => (
				<Card key={index}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<p className="text-xs text-muted-foreground">{stat.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
