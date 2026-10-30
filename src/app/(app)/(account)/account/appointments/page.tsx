"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelMyAppointment, fetchMyAppointments } from "@/api/appointments";
import { AppointmentStatusBadge, dayLabel, hm } from "@/components/verification/appointment-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

/** The patient's own appointment requests and visits. */
export default function MyAppointmentsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["my-appointments", page], queryFn: () => fetchMyAppointments(page, PAGE_SIZE), retry: false, placeholderData: (previous) => previous });
	const cancel = useMutation({
		mutationFn: (id: number) => cancelMyAppointment(id),
		onSuccess: () => {
			toast.success("Appointment cancelled");
			void queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not cancel"),
	});

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">My appointments</CardTitle>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load your appointments"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No appointments yet. Open a verified doctor in the <Link href="/doctors" className="underline">directory</Link> and choose &quot;Book a visit&quot;.
						</p>
					) : (
						<ul className="divide-y">
							{rows.map((a) => (
								<li key={a.id} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
									<div className="space-y-1">
										<p className="font-medium">
											{a.doctorSlug ? (
												<Link href={`/doctors/${a.doctorSlug}`} className="hover:underline">
													{a.doctorName ?? "Doctor"}
												</Link>
											) : (
												(a.doctorName ?? "Doctor")
											)}
										</p>
										<p>
											{dayLabel(a.date)}, {hm(a.startTime)} to {hm(a.endTime)} <AppointmentStatusBadge status={a.status} />
										</p>
										{a.status === "REQUESTED" && <p className="text-muted-foreground">Waiting for the doctor to answer.</p>}
										{a.cancellationReason && <p className="text-muted-foreground">Reason: {a.cancellationReason}</p>}
										<p className="text-xs text-muted-foreground">{a.number}</p>
									</div>
									{a.status === "COMPLETED" && (
										<Button asChild size="sm" variant="outline">
											<Link href={`/account/review?doctor=${a.doctorId}`}>Review this doctor</Link>
										</Button>
									)}
									{(a.status === "REQUESTED" || a.status === "CONFIRMED") && (
										<Button size="sm" variant="outline" disabled={cancel.isPending} onClick={() => { if (window.confirm("Cancel this appointment?")) cancel.mutate(a.id); }}>
											Cancel
										</Button>
									)}
								</li>
							))}
						</ul>
					)}
					{totalPages > 1 && (
						<div className="mt-4 flex items-center justify-between text-sm">
							<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Newer</Button>
							<span className="text-muted-foreground">Page {page} of {totalPages}</span>
							<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Older</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
