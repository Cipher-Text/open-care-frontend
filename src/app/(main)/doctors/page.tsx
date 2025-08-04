import { Card, CardContent } from "@/components/ui/card";

export default function DoctorsPage() {
	return (
		<div className="flex flex-col">
			<h1 className="text-2xl font-bold mb-4">Doctors Management</h1>
			<p className="text-sm text-muted-foreground mb-6">
				Manage and monitor doctor registrations and verifications.
			</p>
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							This page is under construction. Please check back later.
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
