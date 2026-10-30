import { apiGet, apiPatch, apiPost, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export interface Enquiry {
	id: number;
	hospitalId: number;
	hospitalName: string | null;
	fromName: string | null;
	contactPhone: string;
	testName: string | null;
	message: string;
	status: "NEW" | "HANDLED";
	createdAt: string;
	handledAt: string | null;
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/** A signed-in person asks a facility a question. */
export const askFacility = async (hospitalId: number | string, body: { message: string; phone: string; testName?: string }) => {
	const response = await apiPost(`/hospitals/${hospitalId}/enquiries`, body);
	if (!response.ok) throw new Error(response.error || "Could not send your question");
};

/** Enquiries to the facilities the signed-in person is attached to. */
export const fetchEnquiries = async (page: number, size: number): Promise<PageResult<Enquiry>> =>
	normalizePage(unwrap<WirePage<Enquiry>>(await apiGet(buildUrl("/owner/enquiries", { page: toWirePage(page), size })), "Could not load the enquiries"));

export const markEnquiryHandled = async (id: number) => unwrap<Enquiry>(await apiPatch(`/owner/enquiries/${id}/handled`), "Could not mark it handled");
