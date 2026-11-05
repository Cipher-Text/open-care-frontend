import { apiGet, apiPost, buildUrl, unwrap } from "@/lib/api-client";
import { consentRequestShape, patientLookupShape, verified } from "@/lib/api-shapes";
import type {
	ConsentRequest,
	DoctorGrant,
	PatientConsentView,
	PatientGrantView,
	PatientLookup,
} from "@/types/consents";

// ---- Doctor: ask a registered patient for consent before prescribing ----

export const lookupPatient = async (identifier: string) =>
	verified(
		patientLookupShape,
		unwrap<PatientLookup>(await apiGet(buildUrl("/consents/patients/lookup", { identifier })), "No registered patient matches that phone, email or username"),
		"patient"
	);

export const requestConsent = async (patientProfileId: number, identifier: string) =>
	verified(consentRequestShape, unwrap<ConsentRequest>(await apiPost("/consents/requests", { patientProfileId, identifier }), "Could not send the request"), "consent request");

export const fetchConsentRequest = async (id: number) =>
	verified(consentRequestShape, unwrap<ConsentRequest>(await apiGet(`/consents/requests/${id}`), "Could not check the request"), "consent request");

export const verifyConsentCode = async (id: number, code: string) =>
	verified(consentRequestShape, unwrap<ConsentRequest>(await apiPost(`/consents/requests/${id}/verify`, { code }), "That code did not work"), "consent request");

export const fetchDoctorGrants = async () =>
	unwrap<DoctorGrant[]>(await apiGet("/consents/grants"), "Could not load your patients");

// ---- Patient: manage my own consents ----

export const fetchPendingConsents = async () =>
	unwrap<PatientConsentView[]>(await apiGet("/patient/consents/pending"), "Could not load requests");

export const approveConsent = async (id: number) =>
	unwrap(await apiPost(`/patient/consents/${id}/approve`), "Could not approve");

export const denyConsent = async (id: number) =>
	unwrap(await apiPost(`/patient/consents/${id}/deny`), "Could not deny");

export const fetchMyGrants = async () =>
	unwrap<PatientGrantView[]>(await apiGet("/patient/consents/grants"), "Could not load your consents");

export const revokeGrant = async (id: number) =>
	unwrap(await apiPost(`/patient/consents/grants/${id}/revoke`), "Could not take back the consent");
