"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmPhoneCode, sendPhoneCode } from "@/api/phone-verification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Proves the phone number on the profile with a code sent by text message. Shown before a booking when the server says a
 * verified phone is required; `onVerified` runs when the right code has been entered.
 */
export function PhoneVerifyCard({ maskedPhone, onVerified }: { maskedPhone: string | null; onVerified: () => void }) {
	const [codeSent, setCodeSent] = useState(false);
	const [code, setCode] = useState("");
	const [message, setMessage] = useState<string | null>(null);

	const send = useMutation({
		mutationFn: sendPhoneCode,
		onSuccess: () => {
			setCodeSent(true);
			setMessage(null);
			toast.success("We sent you a code by text message");
		},
		onError: (error) => setMessage(error instanceof Error ? error.message : "Could not send the code"),
	});

	const confirm = useMutation({
		mutationFn: () => confirmPhoneCode(code.trim()),
		onSuccess: () => {
			toast.success("Your phone number is verified");
			onVerified();
		},
		onError: (error) => setMessage(error instanceof Error ? error.message : "Could not check the code"),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Verify your phone number</CardTitle>
				<CardDescription>
					The doctor will call you on {maskedPhone ? `the number ending ${maskedPhone.slice(-3)}` : "the number in your profile"}. We send a 6 digit code to it by text message, once, to make sure it is yours.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{!codeSent ? (
					<Button onClick={() => send.mutate()} disabled={send.isPending}>
						{send.isPending ? "Sending..." : "Send me a code"}
					</Button>
				) : (
					<div className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="phone-code">Code from the text message</Label>
							<Input id="phone-code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="max-w-40" />
						</div>
						<div className="flex gap-2">
							<Button onClick={() => confirm.mutate()} disabled={confirm.isPending || code.length !== 6}>
								{confirm.isPending ? "Checking..." : "Verify"}
							</Button>
							<Button variant="outline" onClick={() => send.mutate()} disabled={send.isPending}>
								Send a new code
							</Button>
						</div>
					</div>
				)}
				{message && (
					<Alert variant="destructive">
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
