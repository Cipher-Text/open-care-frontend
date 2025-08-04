import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const chartData = [
	{ name: "Jan", appointments: 400, revenue: 2400 },
	{ name: "Feb", appointments: 300, revenue: 1398 },
	{ name: "Mar", appointments: 200, revenue: 9800 },
	{ name: "Apr", appointments: 278, revenue: 3908 },
	{ name: "May", appointments: 189, revenue: 4800 },
	{ name: "Jun", appointments: 239, revenue: 3800 },
	{ name: "Jul", appointments: 349, revenue: 4300 },
];

export function OverviewChart() {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Monthly Overview</CardTitle>
				<CardDescription>
					Appointments and revenue trends for the past 7 months
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-2">
				<div className="h-[300px] w-full">
					{/* Placeholder for chart - you can integrate with recharts or similar */}
					<div className="flex h-full items-center justify-center bg-muted/10 rounded-lg">
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-2">
								Chart visualization would go here
							</p>
							<p className="text-xs text-muted-foreground">
								Integrate with recharts, chart.js, or similar library
							</p>
							<div className="mt-4 space-y-2">
								{chartData.map((item, index) => (
									<div key={index} className="flex justify-between text-xs">
										<span>{item.name}</span>
										<span>{item.appointments} appointments</span>
										<span>${item.revenue}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
