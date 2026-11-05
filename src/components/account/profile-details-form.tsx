"use client";

import { useEffect, useMemo, useState } from "react";
import { qk } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchDistricts, fetchUnionsByUpazila, fetchUpazilasByDistrict } from "@/api/locations";
import { updateOwnDetails } from "@/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { buildDetails, changed, fromProfile, type DetailsForm } from "@/lib/profile-form";
import type { UserProfile } from "@/types/profile";

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
 * The person edits their own name, phone, date of birth, gender, address and place. The email and username are the login and
 * are not changed here. Changing the phone number asks for it to be verified again where a booking needs that.
 */
export function ProfileDetailsForm({ profile, onSaved }: { profile: UserProfile; onSaved: (next: UserProfile) => void }) {
	const [form, setForm] = useState<DetailsForm>(() => fromProfile(profile));
	const [errors, setErrors] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	// A fresh copy of the profile (after a save elsewhere on the page) resets the form
	useEffect(() => setForm(fromProfile(profile)), [profile]);

	const districts = useQuery({ queryKey: [...qk.districts], queryFn: fetchDistricts, staleTime: Infinity });
	const upazilas = useQuery({ queryKey: [...qk.upazilas, form.districtId], queryFn: () => fetchUpazilasByDistrict(Number(form.districtId)), enabled: form.districtId !== "", staleTime: Infinity });
	const unions = useQuery({ queryKey: [...qk.unions, form.upazilaId], queryFn: () => fetchUnionsByUpazila(form.upazilaId), enabled: form.upazilaId !== "", staleTime: Infinity });

	const dirty = useMemo(() => changed(form, profile), [form, profile]);
	const set = <K extends keyof DetailsForm>(key: K, value: DetailsForm[K]) => setForm((f) => ({ ...f, [key]: value }));

	const save = async () => {
		const built = buildDetails(form);
		if (!built.ok) return setErrors(built.errors);
		setErrors([]);
		setSaving(true);
		try {
			const next = await updateOwnDetails(built.payload);
			onSaved(next);
			toast.success("Your details are saved");
		} catch (error) {
			setErrors([error instanceof Error ? error.message : "Could not save your details"]);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Your details</CardTitle>
				<CardDescription>
					Your email ({profile.email ?? "not set"}) is your login and is not changed here. Keep your phone number right: doctors call you on it.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<Field id="pd-name" label="Name"><Input id="pd-name" value={form.name} maxLength={200} onChange={(e) => set("name", e.target.value)} /></Field>
					<Field id="pd-bn" label="Name in Bangla (optional)"><Input id="pd-bn" lang="bn" value={form.bnName} maxLength={200} onChange={(e) => set("bnName", e.target.value)} /></Field>
					<Field id="pd-phone" label="Phone" hint="Digits only, for example 01712345678"><Input id="pd-phone" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
					<Field id="pd-dob" label="Date of birth"><Input id="pd-dob" type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} /></Field>
					<Field id="pd-gender" label="Gender">
						<NativeSelect id="pd-gender" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
							<option value="">Not said</option>
							<option value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHERS">Others</option>
						</NativeSelect>
					</Field>
					<Field id="pd-district" label="District">
						<NativeSelect id="pd-district" value={form.districtId} onChange={(e) => setForm((f) => ({ ...f, districtId: e.target.value, upazilaId: "", unionId: "" }))}>
							<option value="">Not said</option>
							{(districts.data ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
						</NativeSelect>
					</Field>
					<Field id="pd-upazila" label="Upazila or thana">
						<NativeSelect id="pd-upazila" value={form.upazilaId} disabled={!form.districtId} onChange={(e) => setForm((f) => ({ ...f, upazilaId: e.target.value, unionId: "" }))}>
							<option value="">Not said</option>
							{(upazilas.data ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
						</NativeSelect>
					</Field>
					<Field id="pd-union" label="Union (optional)">
						<NativeSelect id="pd-union" value={form.unionId} disabled={!form.upazilaId} onChange={(e) => set("unionId", e.target.value)}>
							<option value="">Not said</option>
							{(unions.data ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
						</NativeSelect>
					</Field>
				</div>
				<Field id="pd-address" label="Address"><Textarea id="pd-address" rows={2} maxLength={500} value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
				{errors.length > 0 && (
					<Alert variant="destructive">
						<AlertDescription>
							<ul className="list-disc pl-4">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
						</AlertDescription>
					</Alert>
				)}
				<div className="flex gap-2">
					<Button onClick={save} disabled={saving || !dirty}>{saving ? "Saving..." : "Save"}</Button>
					<Button variant="outline" onClick={() => { setForm(fromProfile(profile)); setErrors([]); }} disabled={saving || !dirty}>Undo changes</Button>
				</div>
			</CardContent>
		</Card>
	);
}
