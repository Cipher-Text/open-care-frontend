import { AdminHeader } from "@/components/admin/admin-header";
import { UsersTable } from "@/components/admin/users-table";

export default function UsersPage() {
	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Users Management"
				description="Manage healthcare staff and patient accounts"
			/>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<UsersTable />
			</div>
		</div>
	);
}
