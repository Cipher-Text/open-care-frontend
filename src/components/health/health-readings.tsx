"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addReading, changeReading, deleteReading, fetchMyReadings, type Reading, type ReadingInput } from "@/api/health-vitals";
import { getSelfProfile, updateHealthDataConsent } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 10;

/** The form's text boxes; numbers are converted when sending. */
interface FormState {
	recordedAt: string;
	systolic: string;
	diastolic: string;
	heartRate: string;
	glucose: string;
	glucoseType: string;
	weight: string;
	height: string;
	temperature: string;
	oxygen: string;
	symptoms: string;
	notes: string;
}

const nowLocal = () => {
	const d = new Date();
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d.toISOString().slice(0, 16);
};

const empty = (): FormState => ({ recordedAt: nowLocal(), systolic: "", diastolic: "", heartRate: "", glucose: "", glucoseType: "", weight: "", height: "", temperature: "", oxygen: "", symptoms: "", notes: "" });

const fromReading = (r: Reading): FormState => ({
	recordedAt: r.recordedAt.slice(0, 16),
	systolic: r.bloodPressureSystolic?.toString() ?? "",
	diastolic: r.bloodPressureDiastolic?.toString() ?? "",
	heartRate: r.heartRate?.toString() ?? "",
	glucose: r.bloodGlucoseMgDl?.toString() ?? "",
	glucoseType: r.glucoseMeasurementType ?? "",
	weight: r.weightKg?.toString() ?? "",
	height: r.heightCm?.toString() ?? "",
	temperature: r.temperatureCelsius?.toString() ?? "",
	oxygen: r.oxygenSaturation?.toString() ?? "",
	symptoms: r.symptoms ?? "",
	notes: r.notes ?? "",
});

const num = (text: string) => (text.trim() === "" ? undefined : Number(text));

const toInput = (f: FormState): ReadingInput => ({
	recordedAt: f.recordedAt ? `${f.recordedAt}:00` : undefined,
	bloodPressureSystolic: num(f.systolic),
	bloodPressureDiastolic: num(f.diastolic),
	heartRate: num(f.heartRate),
	bloodGlucoseMgDl: num(f.glucose),
	glucoseMeasurementType: f.glucose.trim() && f.glucoseType ? f.glucoseType : undefined,
	weightKg: num(f.weight),
	heightCm: num(f.height),
	temperatureCelsius: num(f.temperature),
	oxygenSaturation: num(f.oxygen),
	symptoms: f.symptoms.trim() || undefined,
	notes: f.notes.trim() || undefined,
});

const hasAnyNumber = (f: FormState) => [f.systolic, f.diastolic, f.heartRate, f.glucose, f.weight, f.height, f.temperature, f.oxygen].some((t) => t.trim() !== "");

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
	return (
		<div className="space-y-1">
			<Label htmlFor={id}>{label}</Label>
			{children}
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
		</div>
	);
}

/**
 * Keep health readings: the consent the server requires, a form for everyday readings, and the history with change and
 * delete. `onChanged` lets the page above refresh its latest-reading view.
 */
export function HealthReadings({ onChanged }: { onChanged: () => void }) {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [editing, setEditing] = useState<number | "new" | null>(null);
	const [form, setForm] = useState<FormState>(empty());

	const profile = useQuery({ queryKey: ["self-profile"], queryFn: getSelfProfile, retry: false });
	const consented = profile.data?.healthDataConsent === true;
	const list = useQuery({ queryKey: ["my-readings", page], queryFn: () => fetchMyReadings(page, PAGE_SIZE), retry: false, placeholderData: (previous) => previous });

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["my-readings"] });
		onChanged();
	};

	const consent = useMutation({
		mutationFn: () => updateHealthDataConsent(true),
		onSuccess: () => {
			toast.success("Thank you. You can now save readings.");
			void queryClient.invalidateQueries({ queryKey: ["self-profile"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save your choice"),
	});

	const save = useMutation({
		mutationFn: () => (editing === "new" ? addReading(toInput(form)) : changeReading(editing as number, toInput(form))),
		onSuccess: () => {
			toast.success(editing === "new" ? "Reading saved" : "Reading changed");
			setEditing(null);
			refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save the reading"),
	});

	const remove = useMutation({
		mutationFn: (id: number) => deleteReading(id),
		onSuccess: () => {
			toast.success("Reading deleted");
			refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete the reading"),
	});

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="space-y-6">
			{profile.isSuccess && !consented && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Before you save readings</CardTitle>
						<CardDescription>
							Health readings are private: only you can read them, and staff or doctors who open them are recorded under &quot;Who looked&quot; in your account. To keep them, Open Care needs your agreement. You can delete any reading at any time.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => consent.mutate()} disabled={consent.isPending}>I agree to keep my health readings</Button>
					</CardContent>
				</Card>
			)}

			{editing === null ? (
				<Button onClick={() => { setForm(empty()); setEditing("new"); }} disabled={!consented}>
					Record a reading
				</Button>
			) : (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">{editing === "new" ? "Record a reading" : "Change a reading"}</CardTitle>
						<CardDescription>Fill in only what you measured. Medical advice is not given here: talk to your doctor about your readings.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Field id="hv-when" label="When">
							<Input id="hv-when" type="datetime-local" max={nowLocal()} value={form.recordedAt} onChange={(e) => set("recordedAt", e.target.value)} />
						</Field>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Field id="hv-sys" label="Blood pressure, upper (mmHg)">
								<Input id="hv-sys" type="number" inputMode="numeric" min={40} max={300} value={form.systolic} onChange={(e) => set("systolic", e.target.value)} />
							</Field>
							<Field id="hv-dia" label="Blood pressure, lower (mmHg)">
								<Input id="hv-dia" type="number" inputMode="numeric" min={20} max={200} value={form.diastolic} onChange={(e) => set("diastolic", e.target.value)} />
							</Field>
							<Field id="hv-hr" label="Pulse (per minute)">
								<Input id="hv-hr" type="number" inputMode="numeric" min={20} max={300} value={form.heartRate} onChange={(e) => set("heartRate", e.target.value)} />
							</Field>
							<Field id="hv-o2" label="Oxygen (%)">
								<Input id="hv-o2" type="number" inputMode="decimal" min={50} max={100} step="0.1" value={form.oxygen} onChange={(e) => set("oxygen", e.target.value)} />
							</Field>
							<Field id="hv-glu" label="Blood sugar (mg/dL)">
								<Input id="hv-glu" type="number" inputMode="decimal" min={10} max={1500} step="0.1" value={form.glucose} onChange={(e) => set("glucose", e.target.value)} />
							</Field>
							<Field id="hv-glut" label="Sugar taken">
								<NativeSelect id="hv-glut" value={form.glucoseType} onChange={(e) => set("glucoseType", e.target.value)} disabled={!form.glucose.trim()}>
									<option value="">Not said</option>
									<option value="FASTING">Fasting</option>
									<option value="AFTER_MEAL">After a meal</option>
									<option value="RANDOM">Any time</option>
								</NativeSelect>
							</Field>
							<Field id="hv-temp" label="Temperature (°C)">
								<Input id="hv-temp" type="number" inputMode="decimal" min={30} max={45} step="0.1" value={form.temperature} onChange={(e) => set("temperature", e.target.value)} />
							</Field>
							<Field id="hv-wt" label="Weight (kg)">
								<Input id="hv-wt" type="number" inputMode="decimal" min={1} max={500} step="0.1" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
							</Field>
							<Field id="hv-ht" label="Height (cm)">
								<Input id="hv-ht" type="number" inputMode="decimal" min={30} max={260} step="0.1" value={form.height} onChange={(e) => set("height", e.target.value)} />
							</Field>
						</div>
						<Field id="hv-sym" label="Symptoms (optional)">
							<Input id="hv-sym" value={form.symptoms} onChange={(e) => set("symptoms", e.target.value)} maxLength={1000} />
						</Field>
						<Field id="hv-notes" label="Notes (optional)">
							<Textarea id="hv-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} maxLength={1000} rows={2} />
						</Field>
						<div className="flex gap-2">
							<Button onClick={() => save.mutate()} disabled={save.isPending || !hasAnyNumber(form)}>Save</Button>
							<Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">My readings</CardTitle>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load your readings"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-24 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">No readings yet.</p>
					) : (
						<ul className="divide-y">
							{rows.map((r) => (
								<li key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
									<div className="space-y-0.5">
										<p className="font-medium">{when(r.recordedAt)}</p>
										<p className="text-muted-foreground">
											{[
												r.bloodPressureSystolic != null && r.bloodPressureDiastolic != null ? `BP ${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}` : null,
												r.heartRate != null ? `Pulse ${r.heartRate}` : null,
												r.oxygenSaturation != null ? `Oxygen ${r.oxygenSaturation}%` : null,
												r.bloodGlucoseMgDl != null ? `Sugar ${r.bloodGlucoseMgDl}` : null,
												r.temperatureCelsius != null ? `${r.temperatureCelsius} °C` : null,
												r.weightKg != null ? `${r.weightKg} kg` : null,
												r.heightCm != null ? `${r.heightCm} cm` : null,
											].filter(Boolean).join(" · ") || "Other details"}
										</p>
										{r.notes && <p>{r.notes}</p>}
									</div>
									<div className="flex gap-2">
										<Button size="sm" variant="outline" disabled={!consented} onClick={() => { setForm(fromReading(r)); setEditing(r.id); }}>Change</Button>
										<Button size="sm" variant="outline" disabled={remove.isPending} onClick={() => { if (window.confirm("Delete this reading? This cannot be undone.")) remove.mutate(r.id); }}>Delete</Button>
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
	);
}
