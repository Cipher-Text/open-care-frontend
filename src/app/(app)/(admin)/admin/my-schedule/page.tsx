"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMyDoctor } from "@/api/doctors";
import {
	addScheduleBlock,
	deleteScheduleBlock,
	fetchSchedule,
	updateScheduleBlock,
	type DayOfWeek,
	type ScheduleActivity,
	type ScheduleBlock,
	type ScheduleInput,
	type ScheduleMode,
} from "@/api/schedule";
import { fetchDoctorWorkplaces } from "@/api/workplaces";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

/** The week starts on Saturday in Bangladesh; Friday is the usual weekly holiday. */
const DAYS: { value: DayOfWeek; label: string }[] = [
	{ value: "SATURDAY", label: "Saturday" },
	{ value: "SUNDAY", label: "Sunday" },
	{ value: "MONDAY", label: "Monday" },
	{ value: "TUESDAY", label: "Tuesday" },
	{ value: "WEDNESDAY", label: "Wednesday" },
	{ value: "THURSDAY", label: "Thursday" },
	{ value: "FRIDAY", label: "Friday" },
];

const ACTIVITIES: { value: ScheduleActivity; label: string }[] = [
	{ value: "PATIENT_VISIT", label: "Seeing patients" },
	{ value: "OPERATION", label: "Operations" },
	{ value: "TEACHING", label: "Teaching" },
	{ value: "RESEARCH", label: "Research" },
	{ value: "ADMINISTRATIVE", label: "Administration" },
];

const MODES: { value: ScheduleMode; label: string }[] = [
	{ value: "OFFLINE", label: "In person" },
	{ value: "ONLINE", label: "Online" },
	{ value: "BOTH", label: "In person or online" },
];

const hm = (time: string) => time.slice(0, 5);
const activityLabel = (a: ScheduleActivity) => ACTIVITIES.find((x) => x.value === a)?.label ?? a;

interface FormState {
	dayOfWeek: DayOfWeek;
	startTime: string;
	endTime: string;
	activityType: ScheduleActivity;
	appointmentType: ScheduleMode;
	slotDurationMinutes: string;
	maxSlotsPerSession: string;
	consultationFee: string;
	doctorWorkplaceId: string;
	activityDescription: string;
	isBookable: boolean;
	isActive: boolean;
}

const emptyForm = (): FormState => ({
	dayOfWeek: "SATURDAY",
	startTime: "17:00",
	endTime: "20:00",
	activityType: "PATIENT_VISIT",
	appointmentType: "OFFLINE",
	slotDurationMinutes: "",
	maxSlotsPerSession: "",
	consultationFee: "",
	doctorWorkplaceId: "",
	activityDescription: "",
	isBookable: false,
	isActive: true,
});

const fromBlock = (b: ScheduleBlock): FormState => ({
	dayOfWeek: b.dayOfWeek,
	startTime: hm(b.startTime),
	endTime: hm(b.endTime),
	activityType: b.activityType,
	appointmentType: b.appointmentType ?? "OFFLINE",
	slotDurationMinutes: b.slotDurationMinutes?.toString() ?? "",
	maxSlotsPerSession: b.maxSlotsPerSession?.toString() ?? "",
	consultationFee: b.consultationFee?.toString() ?? "",
	doctorWorkplaceId: b.doctorWorkplaceId?.toString() ?? "",
	activityDescription: b.activityDescription ?? "",
	isBookable: b.isBookable,
	isActive: b.isActive,
});

const toInput = (f: FormState): ScheduleInput => {
	const visit = f.activityType === "PATIENT_VISIT";
	return {
		dayOfWeek: f.dayOfWeek,
		startTime: f.startTime,
		endTime: f.endTime,
		activityType: f.activityType,
		appointmentType: visit ? f.appointmentType : undefined,
		slotDurationMinutes: visit && f.slotDurationMinutes ? Number(f.slotDurationMinutes) : undefined,
		maxSlotsPerSession: visit && f.maxSlotsPerSession ? Number(f.maxSlotsPerSession) : undefined,
		consultationFee: visit && f.consultationFee ? Number(f.consultationFee) : undefined,
		doctorWorkplaceId: f.doctorWorkplaceId ? Number(f.doctorWorkplaceId) : undefined,
		activityDescription: f.activityDescription || undefined,
		isBookable: visit ? f.isBookable : false,
		isActive: f.isActive,
	};
};

/** The doctor's weekly schedule: when and where they see patients, operate, teach. Patients cannot book yet. */
export default function MySchedulePage() {
	const queryClient = useQueryClient();
	const [editing, setEditing] = useState<number | "new" | null>(null);
	const [form, setForm] = useState<FormState>(emptyForm());

	const doctor = useQuery({ queryKey: ["my-doctor"], queryFn: fetchMyDoctor, retry: false });
	const doctorId = doctor.data?.id ?? null;
	const schedule = useQuery({ queryKey: ["schedule", doctorId], queryFn: () => fetchSchedule(doctorId as number), enabled: doctorId !== null, retry: false });
	const workplaces = useQuery({ queryKey: ["schedule-workplaces", doctorId], queryFn: () => fetchDoctorWorkplaces(doctorId as number), enabled: doctorId !== null, retry: false });

	const refresh = () => queryClient.invalidateQueries({ queryKey: ["schedule", doctorId] });
	const close = () => setEditing(null);

	const save = useMutation({
		mutationFn: () => (editing === "new" ? addScheduleBlock(doctorId as number, toInput(form)) : updateScheduleBlock(doctorId as number, editing as number, toInput(form))),
		onSuccess: () => {
			toast.success("Schedule saved");
			close();
			void refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
	});

	const remove = useMutation({
		mutationFn: (id: number) => deleteScheduleBlock(doctorId as number, id),
		onSuccess: () => {
			toast.success("Block removed");
			void refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not remove"),
	});

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
	const visit = form.activityType === "PATIENT_VISIT";
	const blocks = schedule.data ?? [];

	return (
		<div className="flex flex-col">
			<AdminHeader title="My schedule" description="Your weekly hours: patients, operations, teaching" />
			<div className="space-y-6 p-4 pt-6 md:p-8">
				<Alert>
					<AlertDescription>Patients cannot book from this schedule yet. It is where booking will start once it is switched on; until then it is only for you.</AlertDescription>
				</Alert>

				{doctor.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{doctor.error instanceof Error ? doctor.error.message : "No doctor record is linked to this account"}</AlertDescription>
					</Alert>
				) : doctor.isLoading || schedule.isLoading ? (
					<Skeleton className="h-48 w-full" />
				) : schedule.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{schedule.error instanceof Error ? schedule.error.message : "Could not load the schedule"}</AlertDescription>
					</Alert>
				) : (
					<>
						{editing === null && (
							<Button onClick={() => { setForm(emptyForm()); setEditing("new"); }}>Add a block</Button>
						)}

						{editing !== null && (
							<Card>
								<CardHeader>
									<CardTitle>{editing === "new" ? "New block" : "Change block"}</CardTitle>
									<CardDescription>Blocks on the same day cannot overlap.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
										<div className="space-y-2">
											<Label htmlFor="day">Day</Label>
											<NativeSelect id="day" value={form.dayOfWeek} onChange={(e) => set("dayOfWeek", e.target.value as DayOfWeek)}>
												{DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
											</NativeSelect>
										</div>
										<div className="space-y-2">
											<Label htmlFor="start">From</Label>
											<Input id="start" type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="end">To</Label>
											<Input id="end" type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="activity">What</Label>
											<NativeSelect id="activity" value={form.activityType} onChange={(e) => set("activityType", e.target.value as ScheduleActivity)}>
												{ACTIVITIES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
											</NativeSelect>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="workplace">Where</Label>
											<NativeSelect id="workplace" value={form.doctorWorkplaceId} onChange={(e) => set("doctorWorkplaceId", e.target.value)}>
												<option value="">Not one of my listed workplaces</option>
												{(workplaces.data ?? []).map((w) => (
													<option key={w.id} value={w.id}>{w.hospital?.name ?? w.institution?.name ?? `Workplace #${w.id}`}</option>
												))}
											</NativeSelect>
										</div>
										<div className="space-y-2">
											<Label htmlFor="note">Note</Label>
											<Input id="note" value={form.activityDescription} onChange={(e) => set("activityDescription", e.target.value)} placeholder="Optional, for example the chamber address" maxLength={500} />
										</div>
									</div>

									{visit && (
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
											<div className="space-y-2">
												<Label htmlFor="mode">Visit type</Label>
												<NativeSelect id="mode" value={form.appointmentType} onChange={(e) => set("appointmentType", e.target.value as ScheduleMode)}>
													{MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
												</NativeSelect>
											</div>
											<div className="space-y-2">
												<Label htmlFor="slot">Minutes per patient</Label>
												<Input id="slot" type="number" min={5} max={240} value={form.slotDurationMinutes} onChange={(e) => set("slotDurationMinutes", e.target.value)} placeholder="30" />
											</div>
											<div className="space-y-2">
												<Label htmlFor="max">Patients per session</Label>
												<Input id="max" type="number" min={1} max={200} value={form.maxSlotsPerSession} onChange={(e) => set("maxSlotsPerSession", e.target.value)} placeholder="As many as fit" />
											</div>
											<div className="space-y-2">
												<Label htmlFor="fee">Fee (৳)</Label>
												<Input id="fee" type="number" min={0} value={form.consultationFee} onChange={(e) => set("consultationFee", e.target.value)} />
											</div>
										</div>
									)}

									{visit && (
										<label className="flex items-center gap-2 text-sm">
											<input type="checkbox" checked={form.isBookable} onChange={(e) => set("isBookable", e.target.checked)} />
											Open this block for booking when booking starts
										</label>
									)}
									<label className="flex items-center gap-2 text-sm">
										<input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
										In use
									</label>

									<div className="flex gap-2">
										<Button onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
										<Button variant="outline" onClick={close}>Cancel</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{DAYS.map((day) => {
							const rows = blocks.filter((b) => b.dayOfWeek === day.value);
							return (
								<Card key={day.value}>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">{day.label}</CardTitle>
									</CardHeader>
									<CardContent>
										{rows.length === 0 ? (
											<p className="text-sm text-muted-foreground">Nothing scheduled.</p>
										) : (
											<ul className="divide-y">
												{rows.map((b) => (
													<li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
														<div className="space-y-0.5">
															<p className="font-medium">
																{hm(b.startTime)} to {hm(b.endTime)} · {activityLabel(b.activityType)}
																{!b.isActive && <Badge variant="secondary" className="ml-2">Not in use</Badge>}
																{b.isBookable && <Badge className="ml-2">For booking</Badge>}
															</p>
															<p className="text-muted-foreground">
																{[b.workplaceName, b.activityType === "PATIENT_VISIT" && b.slotDurationMinutes ? `${b.slotDurationMinutes} min each, up to ${b.maxSlotsPerSession}` : null, b.consultationFee != null ? `৳${b.consultationFee}` : null, b.activityDescription].filter(Boolean).join(" · ")}
															</p>
														</div>
														<div className="flex gap-2">
															<Button size="sm" variant="outline" onClick={() => { setForm(fromBlock(b)); setEditing(b.id); }}>Change</Button>
															<Button size="sm" variant="outline" disabled={remove.isPending} onClick={() => { if (window.confirm("Remove this block?")) remove.mutate(b.id); }}>Remove</Button>
														</div>
													</li>
												))}
											</ul>
										)}
									</CardContent>
								</Card>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}
