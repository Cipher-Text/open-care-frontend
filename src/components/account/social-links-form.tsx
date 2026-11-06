"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSelfProfile, updateSocialLinks } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildSocial, fromSocial, SOCIAL_FIELDS, socialChanged, type SocialForm } from "@/lib/social-links";
import type { UserProfile } from "@/types/profile";

/** The person edits their own social links. They are shown on the profile; a bare domain gets https:// added. */
export function SocialLinksForm({ profile, onSaved }: { profile: UserProfile; onSaved: (next: UserProfile) => void }) {
	const [form, setForm] = useState<SocialForm>(() => fromSocial(profile));
	const [errors, setErrors] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => setForm(fromSocial(profile)), [profile]);
	const dirty = useMemo(() => socialChanged(form, profile), [form, profile]);

	const save = async () => {
		const built = buildSocial(form);
		if (!built.ok) return setErrors(built.errors);
		setErrors([]);
		setSaving(true);
		try {
			await updateSocialLinks(built.payload);
			onSaved(await getSelfProfile());
			toast.success("Your links are saved");
		} catch (error) {
			setErrors([error instanceof Error ? error.message : "Could not save your links"]);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Social links</CardTitle>
				<CardDescription>Optional. Leave a box empty to remove that link.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					{SOCIAL_FIELDS.map(({ key, label }) => (
						<div key={key} className="space-y-1">
							<Label htmlFor={`sl-${key}`}>{label}</Label>
							<Input id={`sl-${key}`} inputMode="url" maxLength={500} placeholder="https://" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
						</div>
					))}
				</div>
				{errors.length > 0 && (
					<Alert variant="destructive">
						<AlertDescription>
							<ul className="list-disc pl-4">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
						</AlertDescription>
					</Alert>
				)}
				<div className="flex gap-2">
					<Button onClick={save} disabled={saving || !dirty}>{saving ? "Saving..." : "Save"}</Button>
					<Button variant="outline" onClick={() => { setForm(fromSocial(profile)); setErrors([]); }} disabled={saving || !dirty}>Undo changes</Button>
				</div>
			</CardContent>
		</Card>
	);
}
