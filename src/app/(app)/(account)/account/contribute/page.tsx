"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchDoctorContributionSummary, fetchTestsOfHospital, searchHospitalsByName, submitContribution } from "@/api/contributions";
import { fetchHospitalTypes, fetchOrganizationTypes } from "@/api/hospitals";
import { fetchDistricts, fetchUpazilasByDistrict } from "@/api/locations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { KIND_WORDS, REQUEST_KEY, textToHtml } from "@/lib/contribution-kind";
import { DegreeListEditor } from "@/components/account/degree-list-editor";
import { degreeProblem, degreesToRequest, emptyDegree, type DegreeRow } from "@/lib/degree-rows";
import { qk } from "@/lib/query-keys";
import type { ContributionKind, ContributionSubmit } from "@/types/contribution";

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const TITLES = [{ value: "NUTRITIONIST", label: "Nutritionist" }, { value: "DIETITIAN", label: "Dietitian" }];
const AMBULANCE_TYPES = ["BASIC", "ADVANCED", "NEONATAL", "PEDIATRIC", "AIR_AMBULANCE"];
const LANGUAGES = [{ value: "bn", label: "Bangla" }, { value: "en", label: "English" }];
const YES_NO = [{ value: "yes", label: "Yes, I accept this test" }, { value: "no", label: "No, I do not accept it" }];

type FieldType = "text" | "select" | "number" | "textarea" | "date" | "article" | "test" | "degrees";
interface FieldSpec {
	key: string;
	label: string;
	required?: boolean;
	type?: FieldType;
	options?: string[];
	choices?: { value: string; label: string }[];
	source?: "hospitalTypes" | "organizationTypes";
}
type Fields = Record<string, string>;
const today = () => new Date().toISOString().slice(0, 10);

/** The fields each kind asks for. A field marked required is what staff need to accept it. */
const FIELDS: Record<ContributionKind, FieldSpec[]> = {
	DOCTOR: [
		{ key: "name", label: "Doctor's name", required: true },
		{ key: "bnName", label: "Name in Bangla" },
		{ key: "gender", label: "Gender", required: true, type: "select", options: GENDERS },
		{ key: "bmdcNo", label: "BMDC registration number", required: true },
		{ key: "specializations", label: "Speciality", required: true },
		{ key: "degrees", label: "Degrees" },
		{ key: "phone", label: "Phone" },
		{ key: "address", label: "Chamber or address" },
	],
	NURSE: [
		{ key: "name", label: "Nurse's name", required: true },
		{ key: "bnName", label: "Name in Bangla" },
		{ key: "gender", label: "Gender", required: true, type: "select", options: GENDERS },
		{ key: "bnmcNo", label: "BNMC registration number", required: true },
		{ key: "description", label: "About", type: "textarea" },
		{ key: "phone", label: "Phone" },
		{ key: "address", label: "Address" },
	],
	NUTRITIONIST: [
		{ key: "name", label: "Name", required: true },
		{ key: "bnName", label: "Name in Bangla" },
		{ key: "gender", label: "Gender", required: true, type: "select", options: GENDERS },
		{ key: "title", label: "Nutritionist or dietitian", type: "select", choices: TITLES },
		{ key: "degreeList", label: "Degrees and qualifications", required: true, type: "degrees" },
		{ key: "registrationNo", label: "Registration number (if they have one)" },
		{ key: "description", label: "About", type: "textarea" },
		{ key: "phone", label: "Phone" },
		{ key: "address", label: "Address" },
	],
	HOSPITAL: [
		{ key: "name", label: "Name", required: true },
		{ key: "bnName", label: "Name in Bangla" },
		{ key: "hospitalType", label: "Type", required: true, type: "select", source: "hospitalTypes" },
		{ key: "organizationType", label: "Run by", required: true, type: "select", source: "organizationTypes" },
		{ key: "numberOfBed", label: "Number of beds", required: true, type: "number" },
		{ key: "address", label: "Address", required: true },
		{ key: "phone", label: "Phone" },
		{ key: "email", label: "Email" },
		{ key: "websiteUrl", label: "Website (https://...)" },
		{ key: "registrationCode", label: "Registration code" },
	],
	AMBULANCE: [
		{ key: "vehicleNumber", label: "Vehicle number", required: true },
		{ key: "type", label: "Type", required: true, type: "select", options: AMBULANCE_TYPES },
		{ key: "driverName", label: "Driver's name" },
		{ key: "driverPhone", label: "Driver's phone", required: true },
	],
	BLOG: [
		{ key: "title", label: "Title", required: true },
		{ key: "summary", label: "One-line summary" },
		{ key: "language", label: "Language", required: true, type: "select", choices: LANGUAGES },
		{ key: "bodyHtml", label: "Article (separate paragraphs with a blank line)", required: true, type: "article" },
	],
	HOSPITAL_TEST_REVIEW: [
		{ key: "hospitalMedicalTestId", label: "The test", required: true, type: "test" },
		{ key: "accepts", label: "Do you accept this test?", required: true, type: "select", choices: YES_NO },
		{ key: "comment", label: "Your review (20 to 1000 characters)", required: true, type: "textarea" },
	],
	MEDICAL_CAMP: [
		{ key: "title", label: "Name of the camp", required: true },
		{ key: "campDate", label: "Date it was held", required: true, type: "date" },
		{ key: "place", label: "Place", required: true },
		{ key: "patientsServed", label: "Patients served", required: true, type: "number" },
		{ key: "description", label: "What was done", type: "textarea" },
	],
	FREE_CONSULTATION: [
		{ key: "consultationDate", label: "Date", required: true, type: "date" },
		{ key: "place", label: "Place", required: true },
		{ key: "patientsServed", label: "Patients seen free of charge", required: true, type: "number" },
		{ key: "description", label: "Anything to add", type: "textarea" },
	],
};

/** Whether a kind asks for a district: always for listings and camps, optional for a free consultation, never for the rest. */
const LOCATION: Record<ContributionKind, "required" | "optional" | "none"> = {
	DOCTOR: "required", NURSE: "required", NUTRITIONIST: "required", HOSPITAL: "required", AMBULANCE: "required",
	BLOG: "none", HOSPITAL_TEST_REVIEW: "none", MEDICAL_CAMP: "required", FREE_CONSULTATION: "optional",
};

const NUMERIC = ["numberOfBed", "patientsServed", "hospitalMedicalTestId"];

/** Choose a hospital by name, then one of the tests it offers. */
function TestPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
	const [search, setSearch] = useState("");
	const [hospitalId, setHospitalId] = useState("");
	const hospitals = useQuery({ queryKey: ["contribute-hospitals", search], queryFn: () => searchHospitalsByName(search), enabled: search.trim().length >= 2 });
	const tests = useQuery({ queryKey: ["contribute-tests", hospitalId], queryFn: () => fetchTestsOfHospital(hospitalId), enabled: hospitalId !== "" });
	return (
		<div className="space-y-2">
			<Input aria-label="Search for the hospital" placeholder="Type the hospital's name" value={search} onChange={(e) => { setSearch(e.target.value); setHospitalId(""); onChange(""); }} />
			{search.trim().length >= 2 && (
				<NativeSelect aria-label="Hospital" value={hospitalId} onChange={(e) => { setHospitalId(e.target.value); onChange(""); }}>
					<option value="">{hospitals.isLoading ? "Searching..." : "Choose the hospital..."}</option>
					{(hospitals.data ?? []).map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
				</NativeSelect>
			)}
			{hospitalId !== "" && (
				<NativeSelect aria-label="Test" value={value} onChange={(e) => onChange(e.target.value)}>
					<option value="">{tests.isLoading ? "Loading tests..." : (tests.data ?? []).length === 0 ? "This hospital lists no tests" : "Choose the test..."}</option>
					{(tests.data ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
				</NativeSelect>
			)}
		</div>
	);
}

/** Add something to Open Care. Staff decide; accepted proposals earn points. Doctor kinds are for verified doctors only. */
export default function ContributePage() {
	const router = useRouter();
	const [kind, setKind] = useState<ContributionKind>("DOCTOR");
	const [fields, setFields] = useState<Fields>({});
	const [districtId, setDistrictId] = useState("");
	const [upazilaId, setUpazilaId] = useState("");
	const [note, setNote] = useState("");
	const [busy, setBusy] = useState(false);
	// a nutritionist's degrees are a list of their own, kept apart from the one-value fields
	const [degreeRows, setDegreeRows] = useState<DegreeRow[]>([emptyDegree()]);

	const doctorScore = useQuery({ queryKey: [...qk.doctorContributionSummary], queryFn: fetchDoctorContributionSummary, retry: false });
	const eligible = doctorScore.data?.eligible === true;
	const districts = useQuery({ queryKey: ["districts-all"], queryFn: fetchDistricts, staleTime: 3_600_000 });
	const upazilas = useQuery({ queryKey: ["upazilas-of", districtId], queryFn: () => fetchUpazilasByDistrict(Number(districtId)), enabled: districtId !== "", staleTime: 3_600_000 });
	const hospitalTypes = useQuery({ queryKey: ["hospital-types"], queryFn: fetchHospitalTypes, staleTime: 3_600_000, enabled: kind === "HOSPITAL" });
	const organizationTypes = useQuery({ queryKey: ["organization-types"], queryFn: fetchOrganizationTypes, staleTime: 3_600_000, enabled: kind === "HOSPITAL" });

	const choices = (f: FieldSpec) => {
		if (f.choices) return f.choices;
		const fromApi = f.source === "hospitalTypes" ? hospitalTypes.data : f.source === "organizationTypes" ? organizationTypes.data : undefined;
		if (fromApi) return fromApi.map((o) => ({ value: o.value ?? o.englishName, label: o.englishName }));
		return (f.options ?? []).map((o) => ({ value: o, label: o.replace(/_/g, " ").toLowerCase() }));
	};

	const spec = FIELDS[kind];
	const location = LOCATION[kind];
	const set = (key: string, value: string) => setFields((f) => ({ ...f, [key]: value }));
	const missing =
		spec.some((f) => f.required && (f.type === "degrees" ? degreesToRequest(degreeRows).length === 0 : !(fields[f.key] ?? "").trim())) ||
		(location === "required" && districtId === "") ||
		(spec.some((f) => f.type === "degrees") && degreeProblem(degreeRows) !== null);

	const send = async () => {
		setBusy(true);
		try {
			const data: Record<string, unknown> = {};
			for (const [k, v] of Object.entries(fields)) {
				const text = v.trim();
				if (!text) continue;
				if (k === "bodyHtml") data[k] = textToHtml(text);
				else if (k === "accepts") data[k] = text === "yes";
				else data[k] = NUMERIC.includes(k) ? Number(text) : text;
			}
			if (spec.some((f) => f.type === "degrees")) data.degreeList = degreesToRequest(degreeRows);
			if (location !== "none" && districtId) data.districtId = Number(districtId);
			if (location !== "none" && upazilaId) data.upazilaId = Number(upazilaId);
			const body = { kind, [REQUEST_KEY[kind]]: data, ...(note.trim() ? { note: note.trim() } : {}) } as unknown as ContributionSubmit;
			await submitContribution(body);
			toast.success("Sent. Staff will look at it; you will see the decision here.");
			router.push("/account/contributions");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not send your proposal");
			setBusy(false);
		}
	};

	const kinds = (Object.keys(KIND_WORDS) as ContributionKind[]);
	return (
		<div className="space-y-4 p-4 md:p-8">
			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle className="text-base">Add information</CardTitle>
					<CardDescription>
						Search first: add only what is not listed yet. You need a verified mobile number. If staff accept it, you earn {KIND_WORDS[kind].points} points.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-1">
						<Label htmlFor="contribute-kind">What are you adding?</Label>
						<NativeSelect id="contribute-kind" value={kind} onChange={(e) => { setKind(e.target.value as ContributionKind); setFields({}); setDistrictId(""); setUpazilaId(""); }}>
							<optgroup label="Add to the directory">
								{kinds.filter((k) => KIND_WORDS[k].track === "GENERAL").map((k) => <option key={k} value={k}>{KIND_WORDS[k].label}</option>)}
							</optgroup>
							{eligible && (
								<optgroup label="As a verified doctor">
									{kinds.filter((k) => KIND_WORDS[k].track === "DOCTOR").map((k) => <option key={k} value={k}>{KIND_WORDS[k].label}</option>)}
								</optgroup>
							)}
						</NativeSelect>
						<p className="text-xs text-muted-foreground">{KIND_WORDS[kind].hint}</p>
						{!eligible && !doctorScore.isLoading && (
							<p className="text-xs text-muted-foreground">
								Articles, test reviews, camps and free consultations are for verified doctors. <Link href="/account/verification" className="text-primary hover:underline">Verify your doctor profile</Link> to unlock them.
							</p>
						)}
					</div>

					{spec.map((f) => (
						<div key={f.key} className="space-y-1">
							<Label htmlFor={`f-${f.key}`}>{f.label}{f.required ? " *" : ""}</Label>
							{f.type === "degrees" ? (
								<DegreeListEditor rows={degreeRows} onChange={setDegreeRows} idPrefix="c-degree" />
							) : f.type === "test" ? (
								<TestPicker value={fields[f.key] ?? ""} onChange={(id) => set(f.key, id)} />
							) : f.type === "select" ? (
								<NativeSelect id={`f-${f.key}`} value={fields[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
									<option value="">Choose...</option>
									{choices(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
								</NativeSelect>
							) : f.type === "article" ? (
								<Textarea id={`f-${f.key}`} value={fields[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={14} maxLength={100000} />
							) : f.type === "textarea" ? (
								<Textarea id={`f-${f.key}`} value={fields[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={3} maxLength={1000} />
							) : (
								<Input
									id={`f-${f.key}`}
									type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
									min={f.type === "number" ? 0 : undefined}
									max={f.type === "date" ? today() : undefined}
									value={fields[f.key] ?? ""}
									onChange={(e) => set(f.key, e.target.value)}
								/>
							)}
						</div>
					))}

					{location !== "none" && (
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="f-district">District{location === "required" ? " *" : ""}</Label>
								<NativeSelect id="f-district" value={districtId} onChange={(e) => { setDistrictId(e.target.value); setUpazilaId(""); }}>
									<option value="">Choose...</option>
									{(districts.data ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
								</NativeSelect>
							</div>
							<div className="space-y-1">
								<Label htmlFor="f-upazila">Upazila</Label>
								<NativeSelect id="f-upazila" value={upazilaId} onChange={(e) => setUpazilaId(e.target.value)} disabled={districtId === ""}>
									<option value="">Choose...</option>
									{(upazilas.data ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
								</NativeSelect>
							</div>
						</div>
					)}

					<div className="space-y-1">
						<Label htmlFor="f-note">Anything staff should know (optional)</Label>
						<Textarea id="f-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} placeholder="Where you saw this information" />
					</div>

					<Alert>
						<AlertDescription>Only add real information you are sure about. Wrong or copied entries are not accepted and earn no points.</AlertDescription>
					</Alert>
					<Button onClick={send} disabled={busy || missing}>
						{busy ? "Sending..." : "Send for review"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
