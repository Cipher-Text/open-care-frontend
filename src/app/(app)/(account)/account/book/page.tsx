"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSlots, requestAppointment, type Slot } from "@/api/appointments";
import { dayLabel, hm } from "@/components/verification/appointment-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

function BookForm() {
	const router = useRouter();
	const doctor = useSearchParams().get("doctor");
	const [chosen, setChosen] = useState<Slot | null>(null);
	const [reason, setReason] = useState("");

	const valid = !!doctor && /^\d+$/.test(doctor);
	const slots = useQuery({ queryKey: ["slots", doctor], queryFn: () => fetchSlots(doctor as string), enabled: valid, retry: false });
	const days = useMemo(() => {
		const byDay = new Map<string, Slot[]>();
		for (const slot of slots.data?.slots ?? []) byDay.set(slot.date, [...(byDay.get(slot.date) ?? []), slot]);
		return [...byDay.entries()];
	}, [slots.data]);

	const send = useMutation({
		mutationFn: () => requestAppointment({ doctorId: Number(doctor), date: chosen!.date, startTime: chosen!.startTime, reason: reason || undefined }),
		onSuccess: () => {
			toast.success("Request sent");
			router.push("/account/appointments");
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Could not send your request");
			void slots.refetch();
			setChosen(null);
		},
	});

	if (!valid) {
		return (
			<Alert>
				<AlertDescription>Open a verified doctor&apos;s page in the directory and choose &quot;Book a visit&quot;.</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Choose a time</CardTitle>
					<CardDescription>
						This is a request: the doctor confirms it, usually within a day, and you are told here and by message. You can cancel until two hours before the visit. Times are Bangladesh time.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{slots.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : slots.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{slots.error instanceof Error ? slots.error.message : "Could not load the open times"}</AlertDescription>
						</Alert>
					) : !slots.data?.bookable ? (
						<Alert>
							<AlertDescription>{slots.data?.message ?? "No times are open for booking right now."}</AlertDescription>
						</Alert>
					) : (
						days.map(([date, list]) => (
							<div key={date} className="space-y-2">
								<p className="text-sm font-medium">{dayLabel(date)}</p>
								<div className="flex flex-wrap gap-2">
									{list.map((slot) => {
										const selected = chosen?.date === slot.date && chosen.startTime === slot.startTime;
										return (
											<Button key={`${slot.date}-${slot.startTime}`} size="sm" variant={selected ? "default" : "outline"} onClick={() => setChosen(slot)}>
												{hm(slot.startTime)}
											</Button>
										);
									})}
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>

			{chosen && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							{dayLabel(chosen.date)}, {hm(chosen.startTime)} to {hm(chosen.endTime)}
						</CardTitle>
						<CardDescription>{chosen.fee ? `Consultation fee: ৳${chosen.fee}, paid at the visit.` : "The doctor will tell you the fee."} The doctor will call you on the phone number in your profile.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="reason">Reason for the visit (optional)</Label>
							<Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} rows={3} placeholder="A few words. Only the doctor sees this." />
						</div>
						<div className="flex gap-2">
							<Button onClick={() => send.mutate()} disabled={send.isPending}>
								{send.isPending ? "Sending..." : "Send the request"}
							</Button>
							<Button variant="outline" onClick={() => setChosen(null)}>
								Choose another time
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Your profile needs a phone number. <Link href="/account/profile" className="underline">Update your profile</Link>
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default function BookPage() {
	return (
		<Suspense fallback={null}>
			<BookForm />
		</Suspense>
	);
}
