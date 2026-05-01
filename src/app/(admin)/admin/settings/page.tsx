import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsForm } from "@/components/admin/settings-form";

export default function SettingsPage() {
	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Settings"
				description="Manage your healthcare system configuration"
			/>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<SettingsForm />
			</div>
		</div>
	);
}
