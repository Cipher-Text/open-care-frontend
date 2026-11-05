import { apiGet, apiPost, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import { fetchPublicHospitals } from "@/api/directory";
import type { Contribution, ContributionKind, ContributionStatus, ContributionSubmit, ContributionSummary, DoctorContributionSummary } from "@/types/contribution";

// ---- the person

export const submitContribution = async (body: ContributionSubmit) =>
	unwrap<Contribution>(await apiPost("/contributions", body), "Could not send your proposal");

export const fetchMyContributions = async () => unwrap<Contribution[]>(await apiGet("/contributions/mine"), "Could not load your proposals");

export const fetchContributionSummary = async () => unwrap<ContributionSummary>(await apiGet("/contributions/summary"), "Could not load your score");

export const fetchDoctorContributionSummary = async () =>
	unwrap<DoctorContributionSummary>(await apiGet("/contributions/summary/doctor"), "Could not load your doctor score");

/** For the hospital test review: find a hospital by name, then choose one of the tests it offers. */
export const searchHospitalsByName = async (name: string) => (await fetchPublicHospitals({ name, page: 1, size: 8 })).content;

export interface OfferedTest {
	id: number;
	name: string;
}

export const fetchTestsOfHospital = async (hospitalId: number | string) =>
	unwrap<OfferedTest[]>(await apiGet(`/hospitals/${hospitalId}/medical-tests`), "Could not load this hospital's tests");

export const withdrawContribution = async (id: number | string) =>
	unwrap<Contribution>(await apiPost(`/contributions/${id}/withdraw`), "Could not withdraw the proposal");

// ---- staff

export interface ContributionQueueFilters {
	page: number;
	size: number;
	kind?: ContributionKind | "";
	status?: ContributionStatus | "";
}

export const fetchContributionQueue = async (filters: ContributionQueueFilters): Promise<PageResult<Contribution>> => {
	const url = buildUrl("/admin/contributions", {
		page: toWirePage(filters.page),
		size: filters.size,
		kind: filters.kind || undefined,
		status: filters.status || undefined,
	});
	return normalizePage(unwrap<WirePage<Contribution>>(await apiGet(url), "Could not load the proposals"));
};

export const fetchContributionDetail = async (id: number | string) =>
	unwrap<Contribution>(await apiGet(`/admin/contributions/${id}`), "Could not load the proposal");

export const approveContribution = async (id: number | string, confirmNotDuplicate = false) =>
	unwrap<Contribution>(await apiPost(`/admin/contributions/${id}/approve`, { confirmNotDuplicate }), "Could not approve");

export const rejectContribution = async (id: number | string, reason: string) =>
	unwrap<Contribution>(await apiPost(`/admin/contributions/${id}/reject`, { reason }), "Could not reject");
