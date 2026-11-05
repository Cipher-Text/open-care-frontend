import { apiGet, apiPost, apiDelete, buildUrl, unwrap } from "@/lib/api-client";

/** A nurse or a nutritionist linked to a hospital. A hospital's own list carries the person's contact details; a person's own list does not. */
export interface StaffWorkplace {
	id: number;
	kind: "NURSE" | "NUTRITIONIST";
	personId: number;
	name: string | null;
	bnName: string | null;
	registrationNo: string | null;
	verified: boolean | null;
	phone: string | null;
	email: string | null;
	hospitalId: number;
	hospitalName: string | null;
	position: string | null;
	startDate: string;
	endDate: string | null;
}

export const KIND_LABEL: Record<StaffWorkplace["kind"], string> = { NURSE: "Nurse", NUTRITIONIST: "Nutritionist" };

/** The nurses and nutritionists at a hospital (for its administrators and platform staff). */
export const fetchHospitalStaff = async (hospitalId: number) => unwrap<StaffWorkplace[]>(await apiGet(`/hospitals/${hospitalId}/staff`), "Could not load the staff");

export const addHospitalStaff = async (hospitalId: number, body: { kind: StaffWorkplace["kind"]; personId: number; position: string }) =>
	unwrap<StaffWorkplace>(
		await apiPost(`/hospitals/${hospitalId}/staff`, {
			nurseId: body.kind === "NURSE" ? body.personId : undefined,
			nutritionistId: body.kind === "NUTRITIONIST" ? body.personId : undefined,
			position: body.position.trim() || undefined,
		}),
		"Could not add the person"
	);

/** Ends a link today (the hospital's administrators, or the person themselves). */
export const endStaffWorkplace = async (id: number) => {
	const response = await apiDelete(`/staff-workplaces/${id}`);
	if (!response.ok) throw new Error(response.error || "Could not end the link");
};

/** Where the signed-in nurse or nutritionist works now. */
export const fetchMyWorkplaces = async () => unwrap<StaffWorkplace[]>(await apiGet("/staff-workplaces/me"), "Could not load where you work");

/**
 * Nurses or nutritionists whose name contains the text, for the picker (a few at a time). Read through the signed-in proxy like the rest
 * of this screen, so it works on any origin the person is signed in on and needs no direct call to the backend.
 */
export async function searchPeople(kind: StaffWorkplace["kind"], text: string): Promise<{ id: number; name: string; detail: string | null }[]> {
	const path = kind === "NURSE" ? "/nurses" : "/nutritionists";
	const page = unwrap<{ content?: { id: number; profile?: { name?: string | null } | null; bnmcNo?: string | null; registrationNo?: string | null }[] }>(
		await apiGet(buildUrl(path, { name: text.trim(), size: 8, page: 0 })),
		"Could not search"
	);
	return (page.content ?? []).map((n) => ({ id: n.id, name: n.profile?.name ?? `${KIND_LABEL[kind]} ${n.id}`, detail: (kind === "NURSE" ? n.bnmcNo : n.registrationNo) ?? null }));
}
