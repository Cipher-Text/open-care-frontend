import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, DollarSign, TrendingUp } from "lucide-react";

const stats = [
	{
		title: "Total Patients",
		value: "2,847",
		description: "+12% from last month",
		icon: Users,
		trend: "up",
	},
	{
		title: "Appointments Today",
		value: "156",
		description: "+8% from yesterday",
		icon: Activity,
		trend: "up",
	},
	{
		title: "Revenue",
		value: "$45,231",
		description: "+15% from last month",
		icon: DollarSign,
		trend: "up",
	},
	{
		title: "Growth Rate",
		value: "12.5%",
		description: "+2.1% from last month",
		icon: TrendingUp,
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
