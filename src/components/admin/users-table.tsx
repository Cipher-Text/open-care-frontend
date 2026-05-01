import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
	{
		id: 1,
		name: "Dr. Sarah Johnson",
		email: "sarah.johnson@opencare.com",
		role: "Doctor",
		department: "Cardiology",
		status: "active",
		lastActive: "2 hours ago",
		avatar: "/avatars/02.png",
		initials: "SJ",
	},
	{
		id: 2,
		name: "Nurse Emma Wilson",
		email: "emma.wilson@opencare.com",
		role: "Nurse",
		department: "Emergency",
		status: "active",
		lastActive: "1 hour ago",
		avatar: "/avatars/03.png",
		initials: "EW",
	},
	{
		id: 3,
		name: "Dr. Michael Brown",
		email: "michael.brown@opencare.com",
		role: "Doctor",
		department: "Pediatrics",
		status: "inactive",
		lastActive: "1 day ago",
		avatar: "/avatars/04.png",
		initials: "MB",
	},
	{
		id: 4,
		name: "Lisa Davis",
		email: "lisa.davis@opencare.com",
		role: "Admin",
		department: "Administration",
		status: "active",
		lastActive: "30 minutes ago",
		avatar: "/avatars/05.png",
		initials: "LD",
	},
	{
		id: 5,
		name: "Dr. Jennifer Lee",
		email: "jennifer.lee@opencare.com",
		role: "Doctor",
		department: "Neurology",
		status: "active",
		lastActive: "15 minutes ago",
		avatar: "/avatars/06.png",
		initials: "JL",
	},
];

const roleColors = {
	Doctor: "bg-blue-100 text-blue-800",
	Nurse: "bg-green-100 text-green-800",
	Admin: "bg-purple-100 text-purple-800",
};

const statusColors = {
	active: "bg-green-100 text-green-800",
	inactive: "bg-gray-100 text-gray-800",
};

export function UsersTable() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Healthcare Staff</CardTitle>
						<CardDescription>
							Manage your team members and their access levels
						</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							<Search className="h-4 w-4 mr-2" />
							Search
						</Button>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-2" />
							Add User
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{users.map((user) => (
						<div
							key={user.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div className="flex items-center space-x-4">
								<Avatar>
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback>{user.initials}</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">{user.name}</div>
									<div className="text-sm text-muted-foreground">
										{user.email}
									</div>
									<div className="text-sm text-muted-foreground">
										{user.department}
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-4">
								<Badge
									variant="secondary"
									className={roleColors[user.role as keyof typeof roleColors]}
								>
									{user.role}
								</Badge>
								<Badge
									variant="secondary"
									className={
										statusColors[user.status as keyof typeof statusColors]
									}
								>
									{user.status}
								</Badge>
								<div className="text-sm text-muted-foreground">
									{user.lastActive}
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem>View profile</DropdownMenuItem>
										<DropdownMenuItem>Edit user</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Deactivate user</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
