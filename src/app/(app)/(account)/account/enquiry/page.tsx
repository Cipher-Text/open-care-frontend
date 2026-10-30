"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { askFacility } from "@/api/enquiries";
import { getSelfProfile } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EnquiryForm() {
	const router = useRouter();
	const params = useSearchParams();
	const hospital = params.get("hospital");
	const [message, setMessage] = useState("");
	const [phone, setPhone] = useState("");
	const [testName, setTestName] = useState(params.get("test") ?? "");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);

	// offer the number already on the profile; the person can change it
	useEffect(() => {
		getSelfProfile().then((p) => setPhone((current) => current || p.phone || "")).catch(() => undefined);
	}, []);

	if (!hospital || !/^\d+$/.test(hospital)) {
		return (
			<Alert>
				<AlertDescription>Open a verified facility&apos;s page in the directory and choose &quot;Ask this facility a question&quot;.</AlertDescription>
			</Alert>
		);
	}

	if (sent) {
		return (
			<Alert>
				<AlertDescription>Your question was sent. The facility will contact you on the number you gave.</AlertDescription>
			</Alert>
		);
	}

	const send = async () => {
		setBusy(true);
		try {
			await askFacility(hospital, { message, phone, testName: testName || undefined });
			setSent(true);
			toast.success("Question sent");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not send your question");
			setBusy(false);
		}
	};

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle className="text-base">Ask this facility a question</CardTitle>
				<CardDescription>
					Your name, your question and the phone number below are sent to the facility so it can answer you. Do not put medical details or national ID numbers in the question.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1">
					<Label htmlFor="enq-test">About a test or service (optional)</Label>
					<Input id="enq-test" value={testName} onChange={(e) => setTestName(e.target.value)} maxLength={200} placeholder="For example: CBC" />
				</div>
				<div className="space-y-1">
					<Label htmlFor="enq-message">Your question</Label>
					<Textarea id="enq-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="enq-phone">Phone number the facility may call</Label>
					<Input id="enq-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
				</div>
				<div className="flex gap-2">
					<Button onClick={send} disabled={busy || !message.trim() || !phone.trim()}>
						{busy ? "Sending..." : "Send"}
					</Button>
					<Button variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default function EnquiryPage() {
	return (
		<Suspense fallback={null}>
			<EnquiryForm />
		</Suspense>
	);
}
