"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateHealthDataConsent } from "@/api/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types/profile";

/**
 * Health vitals are kept only for a person who agrees. Until they do, the backend refuses to save new vitals. Withdrawing
 * stops new entries; vitals already stored stay visible and can be deleted.
 */
export function HealthDataConsent({ profile, onSaved }: { profile: UserProfile; onSaved: (next: Partial<UserProfile>) => void }) {
	const agreed = profile.healthDataConsent === true;
	const [consent, setConsent] = useState(agreed);
	const [consentedAt, setConsentedAt] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const save = async () => {
		setSaving(true);
		try {
			const saved = await updateHealthDataConsent(consent);
			setConsentedAt(saved.consentedAt);
			onSaved({ healthDataConsent: saved.consent });
			toast.success(saved.consent ? "You agreed to keep your health data" : "You withdrew your health data consent");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save your choice");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="h-5 w-5 text-primary" />
					Health data
				</CardTitle>
				<CardDescription>Your choice. You can change it any time.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start gap-3">
					<Checkbox id="health-data-consent" checked={consent} onCheckedChange={(value) => setConsent(value === true)} />
					<Label htmlFor="health-data-consent" className="block leading-snug">
						I agree that Open Care may store my health vitals (such as blood pressure, glucose and weight). Without this, new vitals
						cannot be saved.
					</Label>
				</div>
				<p className="text-sm text-muted-foreground">
					If you withdraw, nothing is deleted: vitals already saved stay visible to you, and you can delete them yourself.
				</p>
				{consentedAt && <p className="text-sm text-muted-foreground">Agreed on {format(new Date(consentedAt), "MMM dd, yyyy")}.</p>}
				<Button onClick={save} disabled={consent === agreed || saving}>
					{saving ? "Saving..." : "Save"}
				</Button>
			</CardContent>
		</Card>
	);
}
