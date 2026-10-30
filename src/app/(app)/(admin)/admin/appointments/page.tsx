"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	cancelAsDoctor,
	completeAppointment,
	confirmAppointment,
	declineAppointment,
	fetchDoctorAppointments,
	markNoShow,
	type Appointment,
} from "@/api/appointments";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppointmentStatusBadge, dayLabel, hm } from "@/components/verification/appointment-status";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

/** Does the visit's start time lie in the past? Times are Bangladesh clock time; the browser is assumed to be there too. */
const started = (a: Appointment) => new Date(`${a.date}T${a.startTime}`).getTime() <= Date.now();

/** The signed-in doctor's booking requests: confirm or decline, cancel, and close visits. */
export default function DoctorAppointmentsPage() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState("REQUESTED");
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["doctor-appointments", status, page], queryFn: () => fetchDoctorAppointments(page, PAGE_SIZE, status || undefined), retry: false, placeholderData: (previous) => previous });

	const done = (message: string) => () => {
		toast.success(message);
		void queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
	};
	const failed = (error: unknown) => toast.error(error instanceof Error ? error.message : "That did not work");

	const confirm = useMutation({ mutationFn: (id: number) => confirmAppointment(id), onSuccess: done("Confirmed. The patient is told."), onError: failed });
	const decline = useMutation({ mutationFn: ({ id, reason }: { id: number; reason?: string }) => declineAppointment(id, reason), onSuccess: done("Declined. The patient is told."), onError: failed });
	const cancel = useMutation({ mutationFn: ({ id, reason }: { id: number; reason: string }) => cancelAsDoctor(id, reason), onSuccess: done("Cancelled. The patient is told."), onError: failed });
	const complete = useMutation({ mutationFn: (id: number) => completeAppointment(id), onSuccess: done("Marked completed"), onError: failed });
	const noShow = useMutation({ mutationFn: (id: number) => markNoShow(id), onSuccess: done("Marked as did not attend"), onError: failed });

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;
	const busy = confirm.isPending || decline.isPending || cancel.isPending || complete.isPending || noShow.isPending;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Appointments" description="Visit requests from patients" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="w-full sm:w-56">
					<NativeSelect aria-label="Show" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
						<option value="REQUESTED">Waiting for me</option>
						<option value="CONFIRMED">Confirmed</option>
						<option value="">All</option>
						<option value="COMPLETED">Completed</option>
						<option value="CANCELLED">Cancelled</option>
						<option value="DECLINED">Declined</option>
						<option value="EXPIRED">Not answered in time</option>
						<option value="NO_SHOW">Did not attend</option>
					</NativeSelect>
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the appointments"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-32 w-full" />
						) : rows.length === 0 ? (
							<p className="text-sm text-muted-foreground">Nothing here. Patients can ask for the blocks you open for booking in My schedule, once you are verified.</p>
						) : (
							<ul className="divide-y">
								{rows.map((a) => (
									<li key={a.id} className="space-y-1 py-3 text-sm">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<p className="font-medium">
												{dayLabel(a.date)}, {hm(a.startTime)} to {hm(a.endTime)} <AppointmentStatusBadge status={a.status} />
											</p>
											<span className="text-xs text-muted-foreground">{a.number}</span>
										</div>
										<p>
											{a.patientName ?? "A patient"} ·{" "}
											{a.patientPhone ? (
												<a href={`tel:${a.patientPhone}`} className="text-primary hover:underline">
													{a.patientPhone}
												</a>
											) : (
												"no phone"
											)}
										</p>
										{a.reason && <p className="text-muted-foreground">Reason: {a.reason}</p>}
										{a.status === "REQUESTED" && a.heldUntil && <p className="text-xs text-muted-foreground">Answer by {dateTime(a.heldUntil)}, or it is released.</p>}
										{a.cancellationReason && <p className="text-muted-foreground">Note: {a.cancellationReason}</p>}
										<div className="flex flex-wrap gap-2 pt-1">
											{a.status === "REQUESTED" && (
												<>
													<Button size="sm" disabled={busy} onClick={() => confirm.mutate(a.id)}>Confirm</Button>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => decline.mutate({ id: a.id, reason: window.prompt("Reason (optional, the patient sees it)") ?? undefined })}>
														Decline
													</Button>
												</>
											)}
											{(a.status === "REQUESTED" || a.status === "CONFIRMED") && (
												<Button size="sm" variant="outline" disabled={busy} onClick={() => { const reason = window.prompt("Why are you cancelling? The patient sees this."); if (reason && reason.trim()) cancel.mutate({ id: a.id, reason }); }}>
													Cancel
												</Button>
											)}
											{a.status === "CONFIRMED" && started(a) && (
												<>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => complete.mutate(a.id)}>Completed</Button>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => noShow.mutate(a.id)}>Did not attend</Button>
												</>
											)}
										</div>
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
		</div>
	);
}
