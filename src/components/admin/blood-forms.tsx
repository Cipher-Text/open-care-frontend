"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createDonation, createRequisition, deleteDonation, deleteRequisition, updateDonation, updateRequisition } from "@/api/blood";
import { fetchHospitals } from "@/api/hospitals";
import { getSelfProfile } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
	BLOOD_COMPONENTS,
	BLOOD_GROUPS,
	REQUISITION_STATUSES,
	buildDonation,
	buildRequisition,
	emptyDonation,
	emptyRequisition,
	type DonationForm,
	type RequisitionForm,
} from "@/lib/blood-form";

/** What the screen knows about a stored requisition or donation, enough to fill the form again. */
export interface StoredRequisition {
	id: number;
	requester?: { id: number } | null;
	patientName: string;
	patientAge?: number | null;
	patientGender?: { value: string } | null;
	bloodGroup?: { value: string } | null;
	bloodComponent?: { value: string } | null;
	quantityBags: number;
	neededByDate: string;
	hospital?: { id: number; name: string } | null;
	contactPerson?: string | null;
	contactPhone?: string | null;
	description?: string | null;
	status?: string | null;
}

export interface StoredDonation {
	id: number;
	donor?: { id: number; name?: string } | null;
	hospital?: { id: number; name: string } | null;
	donationDate: string;
	bloodGroup?: { value: string } | null;
	bloodComponent?: { value: string } | null;
	quantityMl: number;
}

const messageOf = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
	return (
		<div className="space-y-1">
			<Label htmlFor={id}>{label}</Label>
			{children}
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
		</div>
	);
}

/** Search a hospital by name; the directory is far too long for a plain dropdown. */
function HospitalPicker({ value, onChange }: { value: { id: number; name: string } | null; onChange: (hospital: { id: number; name: string } | null) => void }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<{ id: number; name: string; district?: { name?: string } | null }[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		if (query.trim().length < 2) {
			setResults([]);
			return;
		}
		let cancelled = false;
		setSearching(true);
		const timer = setTimeout(async () => {
			try {
				const page = await fetchHospitals({ name: query.trim(), page: 1, size: 8 });
				if (!cancelled) setResults(page.content as { id: number; name: string; district?: { name?: string } | null }[]);
			} catch {
				if (!cancelled) setResults([]);
			} finally {
				if (!cancelled) setSearching(false);
			}
		}, 300);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [query]);

	if (value) {
		return (
			<div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
				<span>{value.name}</span>
				<Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>Change</Button>
			</div>
		);
	}
	return (
		<div className="space-y-1">
			<Input placeholder="Type at least 2 letters of the hospital name" value={query} onChange={(e) => setQuery(e.target.value)} />
			{searching && <p className="text-xs text-muted-foreground">Searching...</p>}
			{results.length > 0 && (
				<ul className="max-h-48 overflow-auto rounded-md border text-sm">
					{results.map((h) => (
						<li key={h.id}>
							<button type="button" className="w-full px-3 py-2 text-left hover:bg-muted" onClick={() => onChange({ id: h.id, name: h.name })}>
								{h.name}
								{h.district?.name ? <span className="text-muted-foreground"> · {h.district.name}</span> : null}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

const bloodGroupOptions = (
	<>
		<option value="">Choose</option>
		{BLOOD_GROUPS.map((g) => (
			<option key={g.value} value={g.value}>{g.label}</option>
		))}
	</>
);
const componentOptions = BLOOD_COMPONENTS.map((c) => (
	<option key={c.value} value={c.value}>{c.label}</option>
));

function Errors({ errors }: { errors: string[] }) {
	if (errors.length === 0) return null;
	return (
		<Alert variant="destructive">
			<AlertDescription>
				<ul className="list-disc pl-4">
					{errors.map((e) => (
						<li key={e}>{e}</li>
					))}
				</ul>
			</AlertDescription>
		</Alert>
	);
}

export function RequisitionDialog({ record, onClose, onSaved }: { record: StoredRequisition | null | undefined; onClose: () => void; onSaved: () => void }) {
	// `undefined` means closed, `null` a new requisition, an object a change
	const open = record !== undefined;
	const [form, setForm] = useState<RequisitionForm>(emptyRequisition());
	const [hospital, setHospital] = useState<{ id: number; name: string } | null>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (record === undefined) return;
		setErrors([]);
		if (record === null) {
			setForm(emptyRequisition());
			setHospital(null);
			return;
		}
		setForm({
			patientName: record.patientName ?? "",
			patientAge: record.patientAge ? String(record.patientAge) : "",
			patientGender: record.patientGender?.value ?? "",
			bloodGroup: record.bloodGroup?.value ?? "",
			bloodComponent: record.bloodComponent?.value ?? "WHOLE_BLOOD",
			quantityBags: String(record.quantityBags ?? 1),
			neededByDate: (record.neededByDate ?? "").slice(0, 10),
			hospitalId: record.hospital?.id ?? null,
			contactPerson: record.contactPerson ?? "",
			contactPhone: record.contactPhone ?? "",
			description: record.description ?? "",
			status: record.status ?? "ACTIVE",
		});
		setHospital(record.hospital ? { id: record.hospital.id, name: record.hospital.name } : null);
	}, [record]);

	const set = <K extends keyof RequisitionForm>(key: K, value: RequisitionForm[K]) => setForm((f) => ({ ...f, [key]: value }));

	const save = async () => {
		let requesterId = record?.requester?.id;
		if (!requesterId) {
			try {
				requesterId = (await getSelfProfile()).id;
			} catch {
				requesterId = undefined;
			}
		}
		const built = buildRequisition({ ...form, hospitalId: hospital?.id ?? null }, requesterId);
		if (!built.ok) return setErrors(built.errors);
		setErrors([]);
		setSaving(true);
		try {
			if (record) await updateRequisition(record.id, built.payload);
			else await createRequisition(built.payload);
			toast.success(record ? "Requisition changed" : "Requisition added");
			onSaved();
			onClose();
		} catch (error) {
			setErrors([messageOf(error, "Could not save the requisition")]);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{record ? "Change requisition" : "Add a blood requisition"}</DialogTitle>
					<DialogDescription>The patient&apos;s name, the contact person and the contact phone are shown on the public requisition list, so donors can call.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field id="rq-patient" label="Patient name"><Input id="rq-patient" value={form.patientName} maxLength={200} onChange={(e) => set("patientName", e.target.value)} /></Field>
					<Field id="rq-age" label="Patient age"><Input id="rq-age" inputMode="numeric" value={form.patientAge} onChange={(e) => set("patientAge", e.target.value)} /></Field>
					<Field id="rq-gender" label="Gender">
						<NativeSelect id="rq-gender" value={form.patientGender} onChange={(e) => set("patientGender", e.target.value)}>
							<option value="">Not said</option>
							<option value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHER">Other</option>
						</NativeSelect>
					</Field>
					<Field id="rq-group" label="Blood group"><NativeSelect id="rq-group" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>{bloodGroupOptions}</NativeSelect></Field>
					<Field id="rq-comp" label="Component"><NativeSelect id="rq-comp" value={form.bloodComponent} onChange={(e) => set("bloodComponent", e.target.value)}>{componentOptions}</NativeSelect></Field>
					<Field id="rq-bags" label="Bags needed"><Input id="rq-bags" inputMode="numeric" value={form.quantityBags} onChange={(e) => set("quantityBags", e.target.value)} /></Field>
					<Field id="rq-date" label="Needed by"><Input id="rq-date" type="date" value={form.neededByDate} onChange={(e) => set("neededByDate", e.target.value)} /></Field>
					<Field id="rq-status" label="Status">
						<NativeSelect id="rq-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
							{REQUISITION_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
						</NativeSelect>
					</Field>
					<div className="sm:col-span-2"><Field id="rq-hospital" label="Hospital"><HospitalPicker value={hospital} onChange={setHospital} /></Field></div>
					<Field id="rq-person" label="Contact person"><Input id="rq-person" value={form.contactPerson} maxLength={200} onChange={(e) => set("contactPerson", e.target.value)} /></Field>
					<Field id="rq-phone" label="Contact phone" hint="Digits only, for example 01712345678"><Input id="rq-phone" inputMode="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></Field>
					<div className="sm:col-span-2"><Field id="rq-desc" label="Details (optional)"><Textarea id="rq-desc" rows={3} maxLength={1000} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
				</div>
				<Errors errors={errors} />
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
					<Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DonationDialog({ record, onClose, onSaved }: { record: StoredDonation | null | undefined; onClose: () => void; onSaved: () => void }) {
	const open = record !== undefined;
	const [form, setForm] = useState<DonationForm>(emptyDonation());
	const [hospital, setHospital] = useState<{ id: number; name: string } | null>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (record === undefined) return;
		setErrors([]);
		if (record === null) {
			setForm(emptyDonation());
			setHospital(null);
			return;
		}
		setForm({
			donorId: record.donor?.id ? String(record.donor.id) : "",
			hospitalId: record.hospital?.id ?? null,
			donationDate: (record.donationDate ?? "").slice(0, 10),
			bloodGroup: record.bloodGroup?.value ?? "",
			bloodComponent: record.bloodComponent?.value ?? "WHOLE_BLOOD",
			quantityMl: String(record.quantityMl ?? 450),
		});
		setHospital(record.hospital ? { id: record.hospital.id, name: record.hospital.name } : null);
	}, [record]);

	const set = <K extends keyof DonationForm>(key: K, value: DonationForm[K]) => setForm((f) => ({ ...f, [key]: value }));

	const save = async () => {
		const built = buildDonation({ ...form, hospitalId: hospital?.id ?? null });
		if (!built.ok) return setErrors(built.errors);
		setErrors([]);
		setSaving(true);
		try {
			if (record) await updateDonation(record.id, built.payload);
			else await createDonation(built.payload);
			toast.success(record ? "Donation changed" : "Donation recorded");
			onSaved();
			onClose();
		} catch (error) {
			setErrors([messageOf(error, "Could not save the donation")]);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{record ? "Change donation" : "Record a donation"}</DialogTitle>
					<DialogDescription>Saving updates the donor&apos;s number of donations and last donation date on their profile.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field id="dn-donor" label="Donor profile number" hint="The number of the donor's profile (see the Donors tab)"><Input id="dn-donor" inputMode="numeric" value={form.donorId} onChange={(e) => set("donorId", e.target.value)} /></Field>
					<Field id="dn-date" label="Donation date"><Input id="dn-date" type="date" value={form.donationDate} onChange={(e) => set("donationDate", e.target.value)} /></Field>
					<Field id="dn-group" label="Blood group"><NativeSelect id="dn-group" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>{bloodGroupOptions}</NativeSelect></Field>
					<Field id="dn-comp" label="Component"><NativeSelect id="dn-comp" value={form.bloodComponent} onChange={(e) => set("bloodComponent", e.target.value)}>{componentOptions}</NativeSelect></Field>
					<Field id="dn-qty" label="Quantity (ml)"><Input id="dn-qty" inputMode="numeric" value={form.quantityMl} onChange={(e) => set("quantityMl", e.target.value)} /></Field>
					<div className="sm:col-span-2"><Field id="dn-hospital" label="Hospital"><HospitalPicker value={hospital} onChange={setHospital} /></Field></div>
				</div>
				<Errors errors={errors} />
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
					<Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/** Asks before a requisition or donation is deleted; a donation's delete also updates the donor's totals. */
export function ConfirmDeleteDialog({ target, onClose, onDeleted }: { target: { kind: "requisition" | "donation"; id: number } | null; onClose: () => void; onDeleted: () => void }) {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const remove = async () => {
		if (!target) return;
		setBusy(true);
		setError(null);
		try {
			if (target.kind === "requisition") await deleteRequisition(target.id);
			else await deleteDonation(target.id);
			toast.success(target.kind === "requisition" ? "Requisition deleted" : "Donation deleted");
			onDeleted();
			onClose();
		} catch (e) {
			setError(messageOf(e, "Could not delete"));
		} finally {
			setBusy(false);
		}
	};

	return (
		<Dialog open={target !== null} onOpenChange={(next) => !next && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete this {target?.kind}?</DialogTitle>
					<DialogDescription>This cannot be undone.{target?.kind === "donation" ? " The donor's number of donations and last donation date are recalculated." : ""}</DialogDescription>
				</DialogHeader>
				{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
					<Button variant="destructive" onClick={remove} disabled={busy}>{busy ? "Deleting..." : "Delete"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
