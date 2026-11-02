/**
 * Pure rules of the blood requisition and donation forms (staff screen `/admin/blood`), kept free of React so they can be
 * tested. The backend checks the same things again; these checks only save a round trip and say what is wrong in plain words.
 */

export const BLOOD_GROUPS = [
	{ value: "A_POSITIVE", label: "A+" },
	{ value: "A_NEGATIVE", label: "A-" },
	{ value: "B_POSITIVE", label: "B+" },
	{ value: "B_NEGATIVE", label: "B-" },
	{ value: "O_POSITIVE", label: "O+" },
	{ value: "O_NEGATIVE", label: "O-" },
	{ value: "AB_POSITIVE", label: "AB+" },
	{ value: "AB_NEGATIVE", label: "AB-" },
] as const;

export const BLOOD_COMPONENTS = [
	{ value: "WHOLE_BLOOD", label: "Whole blood" },
	{ value: "RED_BLOOD_CELLS", label: "Red blood cells" },
	{ value: "PLASMA", label: "Plasma" },
	{ value: "PLATELETS", label: "Platelets" },
] as const;

export const REQUISITION_STATUSES = ["ACTIVE", "FULFILLED", "EXPIRED", "CANCELLED"] as const;

export interface RequisitionForm {
	patientName: string;
	patientAge: string;
	patientGender: string;
	bloodGroup: string;
	bloodComponent: string;
	quantityBags: string;
	neededByDate: string;
	hospitalId: number | null;
	contactPerson: string;
	contactPhone: string;
	description: string;
	status: string;
}

export interface DonationForm {
	donorId: string;
	hospitalId: number | null;
	donationDate: string;
	bloodGroup: string;
	bloodComponent: string;
	quantityMl: string;
}

export type Built<T> = { ok: true; payload: T } | { ok: false; errors: string[] };

const BD_OR_INTERNATIONAL_PHONE = /^\+?[0-9]{10,15}$/;

const wholeNumber = (text: string) => (/^\d+$/.test(text.trim()) ? Number(text.trim()) : NaN);

/** Today as YYYY-MM-DD in the browser's own time zone (dates here are calendar days, not moments). */
export function today(now: Date = new Date()): string {
	const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
	return local.toISOString().slice(0, 10);
}

export function emptyRequisition(): RequisitionForm {
	return { patientName: "", patientAge: "", patientGender: "", bloodGroup: "", bloodComponent: "WHOLE_BLOOD", quantityBags: "1", neededByDate: today(), hospitalId: null, contactPerson: "", contactPhone: "", description: "", status: "ACTIVE" };
}

export function emptyDonation(): DonationForm {
	return { donorId: "", hospitalId: null, donationDate: today(), bloodGroup: "", bloodComponent: "WHOLE_BLOOD", quantityMl: "450" };
}

export interface RequisitionPayload {
	requesterId: number;
	patientName: string;
	patientAge?: number;
	patientGender?: string;
	bloodGroup: string;
	bloodComponent: string;
	quantityBags: number;
	neededByDate: string;
	hospitalId: number;
	contactPerson?: string;
	contactPhone: string;
	description?: string;
	status: string;
}

/** `requesterId` is the signed-in staff member on a new requisition and the original requester on a change. */
export function buildRequisition(form: RequisitionForm, requesterId: number | undefined, now: Date = new Date()): Built<RequisitionPayload> {
	const errors: string[] = [];
	if (!requesterId) errors.push("Your own profile could not be found. Sign in again.");
	if (!form.patientName.trim()) errors.push("Patient name is required.");
	if (form.patientName.trim().length > 200) errors.push("Patient name must be at most 200 characters.");
	const age = form.patientAge.trim() === "" ? undefined : wholeNumber(form.patientAge);
	if (age !== undefined && (Number.isNaN(age) || age < 1 || age > 130)) errors.push("Patient age must be a whole number from 1 to 130.");
	if (!form.bloodGroup) errors.push("Choose a blood group.");
	const bags = wholeNumber(form.quantityBags);
	if (Number.isNaN(bags) || bags < 1 || bags > 20) errors.push("Bags must be a whole number from 1 to 20.");
	if (!form.neededByDate) errors.push("Needed-by date is required.");
	else if (form.status === "ACTIVE" && form.neededByDate < today(now)) errors.push("Needed-by date cannot be in the past.");
	if (!form.hospitalId) errors.push("Choose the hospital.");
	if (!BD_OR_INTERNATIONAL_PHONE.test(form.contactPhone.trim())) errors.push("Contact phone must be 10 to 15 digits, with an optional leading +.");
	if (form.contactPerson.trim().length > 200) errors.push("Contact person must be at most 200 characters.");
	if (form.description.trim().length > 1000) errors.push("Description must be at most 1000 characters.");
	if (errors.length > 0) return { ok: false, errors };
	return {
		ok: true,
		payload: {
			requesterId: requesterId as number,
			patientName: form.patientName.trim(),
			patientAge: age,
			patientGender: form.patientGender || undefined,
			bloodGroup: form.bloodGroup,
			bloodComponent: form.bloodComponent || "WHOLE_BLOOD",
			quantityBags: bags,
			neededByDate: form.neededByDate,
			hospitalId: form.hospitalId as number,
			contactPerson: form.contactPerson.trim() || undefined,
			contactPhone: form.contactPhone.trim(),
			description: form.description.trim() || undefined,
			status: form.status || "ACTIVE",
		},
	};
}

export interface DonationPayload {
	donorId: number;
	hospitalId: number;
	donationDate: string;
	bloodGroup: string;
	bloodComponent: string;
	quantityMl: number;
}

export function buildDonation(form: DonationForm, now: Date = new Date()): Built<DonationPayload> {
	const errors: string[] = [];
	const donorId = wholeNumber(form.donorId);
	if (Number.isNaN(donorId) || donorId < 1) errors.push("Donor ID must be the donor's profile number.");
	if (!form.hospitalId) errors.push("Choose the hospital.");
	if (!form.donationDate) errors.push("Donation date is required.");
	else if (form.donationDate > today(now)) errors.push("Donation date cannot be in the future.");
	if (!form.bloodGroup) errors.push("Choose a blood group.");
	const quantity = wholeNumber(form.quantityMl);
	if (Number.isNaN(quantity) || quantity < 50 || quantity > 1000) errors.push("Quantity must be a whole number of ml from 50 to 1000.");
	if (errors.length > 0) return { ok: false, errors };
	return { ok: true, payload: { donorId, hospitalId: form.hospitalId as number, donationDate: form.donationDate, bloodGroup: form.bloodGroup, bloodComponent: form.bloodComponent || "WHOLE_BLOOD", quantityMl: quantity } };
}
