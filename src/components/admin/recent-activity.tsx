import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentActivities = [
	{
		id: 1,
		user: "Dr. Sarah Johnson",
		action: "completed appointment with",
		patient: "John Doe",
		time: "2 minutes ago",
		status: "completed",
		avatar: "/avatars/02.png",
		initials: "SJ",
	},
	{
		id: 2,
		user: "Nurse Emma Wilson",
		action: "updated patient records for",
		patient: "Jane Smith",
		time: "5 minutes ago",
		status: "updated",
		avatar: "/avatars/03.png",
		initials: "EW",
	},
	{
		id: 3,
		user: "Dr. Michael Brown",
		action: "scheduled follow-up with",
		patient: "Robert Johnson",
		time: "10 minutes ago",
		status: "scheduled",
		avatar: "/avatars/04.png",
		initials: "MB",
	},
	{
		id: 4,
		user: "Admin Staff",
		action: "processed payment from",
		patient: "Lisa Davis",
		time: "15 minutes ago",
		status: "payment",
		avatar: "/avatars/05.png",
		initials: "AS",
	},
	{
		id: 5,
		user: "Dr. Jennifer Lee",
		action: "created new prescription for",
		patient: "Mark Wilson",
		time: "20 minutes ago",
		status: "prescription",
		avatar: "/avatars/06.png",
		initials: "JL",
	},
];

const statusColors = {
	completed: "bg-green-100 text-green-800",
	updated: "bg-blue-100 text-blue-800",
	scheduled: "bg-yellow-100 text-yellow-800",
	payment: "bg-purple-100 text-purple-800",
	prescription: "bg-orange-100 text-orange-800",
};

export function RecentActivity() {
	return (
		<Card className="col-span-3">
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>
					Latest activities in your healthcare system
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{recentActivities.map((activity) => (
						<div key={activity.id} className="flex items-center">
							<Avatar className="h-9 w-9">
								<AvatarImage src={activity.avatar} alt={activity.user} />
								<AvatarFallback>{activity.initials}</AvatarFallback>
							</Avatar>
							<div className="ml-4 space-y-1 flex-1">
								<p className="text-sm font-medium leading-none">
									{activity.user} {activity.action} {activity.patient}
								</p>
								<p className="text-sm text-muted-foreground">{activity.time}</p>
							</div>
							<Badge
								variant="secondary"
								className={
									statusColors[activity.status as keyof typeof statusColors]
								}
							>
								{activity.status}
							</Badge>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
