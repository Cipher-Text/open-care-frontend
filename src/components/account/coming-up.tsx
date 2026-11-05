"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText } from "lucide-react";
import { fetchMyAppointments } from "@/api/appointments";
import { fetchMyPrescriptions } from "@/api/prescriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { qk } from "@/lib/query-keys";

const today = () => new Date().toISOString().slice(0, 10);

/** What is next for the person: their next visits and their latest prescription, each a way in to the full list. */
export function ComingUp() {
	const appointments = useQuery({ queryKey: [...qk.myAppointments, "home"], queryFn: () => fetchMyAppointments(1, 10), retry: false });
	const prescriptions = useQuery({ queryKey: [...qk.myPrescriptions, "home"], queryFn: () => fetchMyPrescriptions(1, 1), retry: false });

	const upcoming = (appointments.data?.content ?? [])
		.filter((a) => (a.status === "REQUESTED" || a.status === "CONFIRMED") && a.date >= today())
		.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
		.slice(0, 3);
	const latest = prescriptions.data?.content?.[0];

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<CalendarDays className="size-5 text-primary" aria-hidden="true" />
						Coming up
					</CardTitle>
					<CardDescription>Your next visits</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{appointments.isLoading ? (
						<p className="text-sm text-muted-foreground">Loading</p>
					) : upcoming.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No visits booked. <Link href="/doctors" className="text-primary hover:underline">Find a doctor</Link>
						</p>
					) : (
						<ul className="divide-y rounded-md border">
							{upcoming.map((a) => (
								<li key={a.id}>
									<Link href="/account/appointments" className="flex items-center justify-between gap-2 p-3 text-sm hover:bg-accent">
										<span className="min-w-0">
											<span className="block truncate font-medium">{a.doctorName ?? "Doctor"}</span>
											<span className="block text-xs text-muted-foreground">
												{a.date}, {a.startTime.slice(0, 5)}
											</span>
										</span>
										<span className="shrink-0 text-xs text-muted-foreground">{a.status === "CONFIRMED" ? "Confirmed" : "Waiting for the doctor"}</span>
									</Link>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<FileText className="size-5 text-primary" aria-hidden="true" />
						Latest prescription
					</CardTitle>
					<CardDescription>What your doctor wrote most recently</CardDescription>
				</CardHeader>
				<CardContent>
					{prescriptions.isLoading ? (
						<p className="text-sm text-muted-foreground">Loading</p>
					) : !latest ? (
						<p className="text-sm text-muted-foreground">No prescriptions yet.</p>
					) : (
						<Link href={`/account/prescriptions/${latest.id}`} className="block rounded-md border p-3 text-sm hover:bg-accent">
							<span className="block font-medium">{latest.diagnosis}</span>
							<span className="block text-xs text-muted-foreground">
								{latest.doctorName ?? "Doctor"}, {latest.prescriptionDate}, {latest.medicineCount} {latest.medicineCount === 1 ? "medicine" : "medicines"}
								{latest.voided ? ", marked as a mistake" : latest.replaced ? ", replaced by a newer copy" : ""}
							</span>
						</Link>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
