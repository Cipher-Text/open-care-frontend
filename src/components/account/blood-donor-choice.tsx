"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { updateBloodDonorChoice } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types/profile";

/**
 * Being a blood donor is the person's own choice. Agreeing lists them for Plus and Pro members and staff; their phone and
 * address are shown only if they tick them, and their email never is. Unticking removes them from the list.
 */
export function BloodDonorChoice({ profile, onSaved }: { profile: UserProfile; onSaved: (next: Partial<UserProfile>) => void }) {
	// A donor with no recorded consent (listed before consent existed) is shown as not agreed, until they agree again
	const agreed = profile.isBloodDonor && profile.bloodDonorConsentAt !== null;
	const [donor, setDonor] = useState(agreed);
	const [sharePhone, setSharePhone] = useState(profile.donorSharePhone);
	const [shareAddress, setShareAddress] = useState(profile.donorShareAddress);
	const [saving, setSaving] = useState(false);

	const changed = donor !== agreed || (donor && (sharePhone !== profile.donorSharePhone || shareAddress !== profile.donorShareAddress));
	const needsBloodGroup = donor && !profile.bloodGroup;

	const save = async () => {
		setSaving(true);
		try {
			const saved = await updateBloodDonorChoice({ donor, sharePhone: donor && sharePhone, shareAddress: donor && shareAddress });
			setSharePhone(saved.sharePhone);
			setShareAddress(saved.shareAddress);
			onSaved({
				isBloodDonor: saved.donor,
				bloodDonorConsentAt: saved.consentedAt,
				donorSharePhone: saved.sharePhone,
				donorShareAddress: saved.shareAddress,
			});
			toast.success(saved.donor ? "You are listed as a blood donor" : "You are no longer listed as a blood donor");
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
					<Heart className="h-5 w-5 text-destructive" />
					Blood donor
				</CardTitle>
				<CardDescription>Your choice. You can change it any time.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start gap-3">
					<Checkbox id="blood-donor" checked={donor} onCheckedChange={(value) => setDonor(value === true)} />
					<Label htmlFor="blood-donor" className="block leading-snug">
						I am willing to donate blood, and I agree to be listed as a blood donor. People with a Plus or Pro plan, and Open
						Care staff who manage blood, can see my name, blood group and area.
					</Label>
				</div>

				{donor && (
					<div className="space-y-3 border-l-2 pl-4">
						<p className="text-sm text-muted-foreground">Only share what you are comfortable with. Your email is never shown.</p>
						<div className="flex items-center gap-3">
							<Checkbox id="share-phone" checked={sharePhone} onCheckedChange={(value) => setSharePhone(value === true)} />
							<Label htmlFor="share-phone">Show my phone number</Label>
						</div>
						<div className="flex items-center gap-3">
							<Checkbox id="share-address" checked={shareAddress} onCheckedChange={(value) => setShareAddress(value === true)} />
							<Label htmlFor="share-address">Show my address</Label>
						</div>
					</div>
				)}

				{needsBloodGroup && (
					<Alert>
						<AlertDescription>Add your blood group to your profile first. Without it you cannot be listed.</AlertDescription>
					</Alert>
				)}

				{profile.isBloodDonor && profile.bloodDonorConsentAt === null && (
					<Alert>
						<AlertDescription>You were marked as a donor before choices existed. You are not listed until you agree here.</AlertDescription>
					</Alert>
				)}

				<Button onClick={save} disabled={!changed || saving || needsBloodGroup}>
					{saving ? "Saving..." : "Save"}
				</Button>
			</CardContent>
		</Card>
	);
}
