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
					<input
						type="text"
						className="w-full mt-1 px-3 py-2 border border-input rounded-md"
						placeholder="OpenCare"
					/>
				</div>
				<div>
					<label className="text-sm font-medium">Admin Email</label>
					<input
						type="email"
						className="w-full mt-1 px-3 py-2 border border-input rounded-md"
						placeholder="admin@opencare.com"
					/>
				</div>
			</div>
		</div>
	);
}
