import { Input } from "@/components/ui/input";

export function SettingsForm() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General Settings</h3>
				<p className="text-sm text-muted-foreground">
					Manage your application settings.
				</p>
			</div>
			<div className="space-y-4">
				<div>
					<label className="text-sm font-medium">Application Name</label>
					<Input
						type="text"
						className="mt-1"
						placeholder="OpenCare"
					/>
				</div>
				<div>
					<label className="text-sm font-medium">Admin Email</label>
					<Input
						type="email"
						className="mt-1"
						placeholder="admin@opencare.com"
					/>
				</div>
			</div>
		</div>
	);
}
