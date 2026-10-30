"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { toast } from "sonner";
import { type MessageLanguage, updatePreferredLanguage } from "@/api/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types/profile";

const OPTIONS: { value: MessageLanguage; label: string; sample: string }[] = [
	{ value: "bn", label: "বাংলা (Bangla)", sample: "Open Care: ... আপনার জন্য প্রেসক্রিপশন লিখতে চান। আপনার কোড 123456।" },
	{ value: "en", label: "English", sample: "Open Care: ... wants to write a prescription for you. Your code is 123456." },
];

/**
 * The language of the text messages Open Care sends to this person, for example the code a doctor asks them for. Until
 * they choose, messages are in English. Bangla messages are sent as Unicode text and are longer, so they cost more to send.
 */
export function MessageLanguageChoice({ profile, onSaved }: { profile: UserProfile; onSaved: (next: Partial<UserProfile>) => void }) {
	const saved = profile.preferredLanguage ?? null;
	const [choice, setChoice] = useState<MessageLanguage>(saved ?? "en");
	const [saving, setSaving] = useState(false);

	const save = async () => {
		setSaving(true);
		try {
			const result = await updatePreferredLanguage(choice);
			onSaved({ preferredLanguage: result.language });
			toast.success(result.language === "bn" ? "Text messages will be in Bangla" : "Text messages will be in English");
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
					<Languages className="h-5 w-5 text-primary" />
					Language of text messages
				</CardTitle>
				<CardDescription>
					{saved ? "Your choice. You can change it any time." : "Not chosen yet: messages are sent in English."}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<fieldset className="space-y-3">
					<legend className="sr-only">Language of text messages</legend>
					{OPTIONS.map((option) => (
						<div key={option.value} className="flex items-start gap-3">
							<input
								type="radio"
								id={`message-language-${option.value}`}
								name="message-language"
								value={option.value}
								checked={choice === option.value}
								onChange={() => setChoice(option.value)}
								className="mt-1 size-4 accent-primary"
							/>
							<Label htmlFor={`message-language-${option.value}`} className="block font-normal leading-snug">
								<span className="font-medium">{option.label}</span>
								<span className="mt-0.5 block text-sm text-muted-foreground" lang={option.value}>
									{option.sample}
								</span>
							</Label>
						</div>
					))}
				</fieldset>
				<Button onClick={save} disabled={choice === saved || saving}>
					{saving ? "Saving..." : "Save"}
				</Button>
			</CardContent>
		</Card>
	);
}
