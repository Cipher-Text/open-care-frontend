"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignPlan, cancelSubscription, fetchSubscriptionHistory, type PlanAudience, type PlanTier } from "@/api/subscriptions";
import { fetchDoctors } from "@/api/doctors";
import { fetchHospitals } from "@/api/hospitals";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Subject {
	id: number;
	name: string;
}

const AUDIENCES: { value: PlanAudience; label: string }[] = [
	{ value: "DOCTOR", label: "Doctor" },
	{ value: "HOSPITAL", label: "Hospital" },
	{ value: "CLINIC", label: "Clinic or diagnostic centre" },
	{ value: "PATIENT", label: "Patient (profile)" },
];

const TIERS: { value: PlanTier; label: string }[] = [
	{ value: "FREE", label: "Free (ends the paid plan)" },
	{ value: "PLUS", label: "Plus" },
	{ value: "PRO", label: "Pro" },
];

/** A local date-time at the end of the chosen day, as the API reads it (no zone). */
const endOfDay = (date: string) => `${date}T23:59:00`;

const tomorrow = () => {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return d.toISOString().slice(0, 10);
};

/**
 * Staff put a doctor, facility or patient on a plan and end it again. Nobody pays inside the app yet: a payment is taken
 * outside (for example bKash), then a staff member records the plan here for the period that was paid.
 */
export default function SubscriptionsPage() {
	const queryClient = useQueryClient();
	const [audience, setAudience] = useState<PlanAudience>("DOCTOR");
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<Subject[]>([]);
	const [searching, setSearching] = useState(false);
	const [subject, setSubject] = useState<Subject | null>(null);
	const [profileId, setProfileId] = useState("");
	const [tier, setTier] = useState<PlanTier>("PLUS");
	const [endDate, setEndDate] = useState(tomorrow());
	const [noEnd, setNoEnd] = useState(false);

	const subjectId = subject?.id ?? null;
	const history = useQuery({
		queryKey: ["subscriptions", audience, subjectId],
		queryFn: () => fetchSubscriptionHistory(audience, subjectId as number),
		enabled: subjectId !== null,
		retry: false,
	});

	const changeAudience = (value: PlanAudience) => {
		setAudience(value);
		setSubject(null);
		setResults([]);
		setSearch("");
		setProfileId("");
	};

	const runSearch = async () => {
		const text = search.trim();
		if (text.length < 2) return;
		setSearching(true);
		try {
			const page = audience === "DOCTOR" ? await fetchDoctors({ name: text, page: 1, size: 8 }) : await fetchHospitals({ name: text, page: 1, size: 8 });
			setResults((page.content as unknown as Subject[]).map((row) => ({ id: row.id, name: row.name })));
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Search failed");
		} finally {
			setSearching(false);
		}
	};

	const pickProfile = () => {
		const id = Number(profileId);
		if (Number.isInteger(id) && id > 0) setSubject({ id, name: `Profile #${id}` });
	};

	const refresh = () => queryClient.invalidateQueries({ queryKey: ["subscriptions", audience, subjectId] });

	const assign = useMutation({
		mutationFn: () => assignPlan({ audience, subjectId: subjectId as number, tier, endsAt: tier === "FREE" || noEnd ? undefined : endOfDay(endDate) }),
		onSuccess: () => {
			toast.success(tier === "FREE" ? "Paid plan ended" : "Plan recorded");
			void refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not assign the plan"),
	});

	const cancel = useMutation({
		mutationFn: (id: number) => cancelSubscription(id),
		onSuccess: () => {
			toast.success("Plan ended");
			void refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not end the plan"),
	});

	const needsList = audience !== "PATIENT";

	return (
		<div className="flex flex-col">
			<AdminHeader title="Plans" description="Put a doctor, facility or patient on a plan" />
			<div className="space-y-6 p-4 pt-6 md:p-8">
				<Alert>
					<AlertDescription>
						Nobody pays inside the app yet. Take the payment outside, then record the plan here for the period that was paid. Assigning a plan ends the current one first.
					</AlertDescription>
				</Alert>

				<Card>
					<CardHeader>
						<CardTitle>1. Who</CardTitle>
						<CardDescription>{needsList ? "Search by name and pick the record." : "Enter the profile number (shown on the Profiles page)."}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="max-w-xs space-y-2">
							<Label htmlFor="audience">Kind</Label>
							<NativeSelect id="audience" value={audience} onChange={(e) => changeAudience(e.target.value as PlanAudience)}>
								{AUDIENCES.map((a) => (
									<option key={a.value} value={a.value}>
										{a.label}
									</option>
								))}
							</NativeSelect>
						</div>
						{needsList ? (
							<div className="space-y-2">
								<Label htmlFor="search">Name</Label>
								<form className="flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); void runSearch(); }}>
									<Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="At least 2 letters" />
									<Button type="submit" variant="outline" disabled={searching || search.trim().length < 2}>
										Search
									</Button>
								</form>
								{results.length > 0 && (
									<ul className="max-w-md divide-y rounded-md border">
										{results.map((r) => (
											<li key={r.id}>
												<button type="button" className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent" onClick={() => setSubject(r)}>
													<span>{r.name}</span>
													<span className="text-muted-foreground">#{r.id}</span>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						) : (
							<form className="flex max-w-xs items-end gap-2" onSubmit={(e) => { e.preventDefault(); pickProfile(); }}>
								<div className="flex-1 space-y-2">
									<Label htmlFor="profile">Profile number</Label>
									<Input id="profile" inputMode="numeric" value={profileId} onChange={(e) => setProfileId(e.target.value)} />
								</div>
								<Button type="submit" variant="outline">
									Use
								</Button>
							</form>
						)}
						{subject && (
							<p className="text-sm">
								Selected: <strong>{subject.name}</strong> ({audience.toLowerCase()} #{subject.id})
							</p>
						)}
					</CardContent>
				</Card>

				{subject && (
					<>
						<Card>
							<CardHeader>
								<CardTitle>2. Plan</CardTitle>
								<CardDescription>The end date is the last day that was paid for.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid max-w-xl gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="tier">Plan</Label>
										<NativeSelect id="tier" value={tier} onChange={(e) => setTier(e.target.value as PlanTier)}>
											{TIERS.map((t) => (
												<option key={t.value} value={t.value}>
													{t.label}
												</option>
											))}
										</NativeSelect>
									</div>
									{tier !== "FREE" && (
										<div className="space-y-2">
											<Label htmlFor="ends">Ends on</Label>
											<Input id="ends" type="date" min={tomorrow()} value={endDate} disabled={noEnd} onChange={(e) => setEndDate(e.target.value)} />
										</div>
									)}
								</div>
								{tier !== "FREE" && (
									<label className="flex items-center gap-2 text-sm">
										<input type="checkbox" checked={noEnd} onChange={(e) => setNoEnd(e.target.checked)} />
										No end date (runs until someone ends it)
									</label>
								)}
								<Button onClick={() => assign.mutate()} disabled={assign.isPending || (tier !== "FREE" && !noEnd && !endDate)}>
									{tier === "FREE" ? "End the paid plan" : "Record the plan"}
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>History</CardTitle>
							</CardHeader>
							<CardContent>
								{history.isError ? (
									<Alert variant="destructive">
										<AlertDescription>{history.error instanceof Error ? history.error.message : "Could not load the history"}</AlertDescription>
									</Alert>
								) : history.isLoading ? (
									<Skeleton className="h-24 w-full" />
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Plan</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Started</TableHead>
												<TableHead>Ends</TableHead>
												<TableHead>Set by</TableHead>
												<TableHead />
											</TableRow>
										</TableHeader>
										<TableBody>
											{(history.data ?? []).map((s) => (
												<TableRow key={s.id}>
													<TableCell className="font-medium">{s.tier}</TableCell>
													<TableCell>
														<Badge variant={s.status === "ACTIVE" ? "default" : "secondary"}>{s.status === "ACTIVE" ? "Active" : "Ended"}</Badge>
													</TableCell>
													<TableCell className="whitespace-nowrap">{dateTime(s.startedAt)}</TableCell>
													<TableCell className="whitespace-nowrap">{s.endsAt ? dateTime(s.endsAt) : s.status === "ACTIVE" ? "Until ended" : dateTime(s.cancelledAt)}</TableCell>
													<TableCell>{s.assignedBy ?? "-"}</TableCell>
													<TableCell className="text-right">
														{s.status === "ACTIVE" && (
															<Button size="sm" variant="outline" disabled={cancel.isPending} onClick={() => cancel.mutate(s.id)}>
																End now
															</Button>
														)}
													</TableCell>
												</TableRow>
											))}
											{(history.data ?? []).length === 0 && (
												<TableRow>
													<TableCell colSpan={6} className="text-center text-muted-foreground">
														No paid plan yet. This record is on the Free plan.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
