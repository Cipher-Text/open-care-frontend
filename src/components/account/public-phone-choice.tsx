"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { updatePublicPhone } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types/profile";

/**
 * A doctor's phone number is hidden on the public pages unless they choose to show it. Email, date of birth and address
 * are never shown. Only for doctors, and only when the profile has a phone number.
 */
export function PublicPhoneChoice({ profile, onSaved }: { profile: UserProfile; onSaved: (next: Partial<UserProfile>) => void }) {
	const agreed = profile.publicPhone === true;
	const [show, setShow] = useState(agreed);
	const [saving, setSaving] = useState(false);
	const hasPhone = Boolean(profile.phone && profile.phone.trim());

	const save = async () => {
		setSaving(true);
		try {
			const saved = await updatePublicPhone(show);
			onSaved({ publicPhone: saved.show });
			toast.success(saved.show ? "Your phone number is now shown on your public page" : "Your phone number is hidden");
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
					<Phone className="h-5 w-5 text-primary" />
					Phone on your public page
				</CardTitle>
				<CardDescription>Your choice. You can change it any time.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start gap-3">
					<Checkbox id="public-phone" checked={show} disabled={!hasPhone} onCheckedChange={(value) => setShow(value === true)} />
					<Label htmlFor="public-phone" className="block leading-snug">
						Show my phone number on my public doctor page, so patients can call me. Anyone who visits the page can see it. My email,
						date of birth and address are never shown.
					</Label>
				</div>
				{!hasPhone && (
					<Alert>
						<AlertDescription>Add a phone number to your profile first. Without it there is nothing to show.</AlertDescription>
					</Alert>
				)}
				<Button onClick={save} disabled={show === agreed || saving || (show && !hasPhone)}>
					{saving ? "Saving..." : "Save"}
				</Button>
			</CardContent>
		</Card>
	);
}
