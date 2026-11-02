import { apiDelete, apiPost, apiPut } from "@/lib/api-client";
import type { DonationPayload, RequisitionPayload } from "@/lib/blood-form";

/**
 * Staff changes to blood requisitions and donations (`manage-blood`; a hospital administrator only at their own facility,
 * the backend decides). A refusal is thrown as an ApiError with the server's message.
 */
export const createRequisition = (payload: RequisitionPayload) => apiPost("/blood-requisitions", payload);
export const updateRequisition = (id: number, payload: RequisitionPayload) => apiPut(`/blood-requisitions/${id}`, payload);
export const deleteRequisition = (id: number) => apiDelete(`/blood-requisitions/${id}`);

export const createDonation = (payload: DonationPayload) => apiPost("/blood-donations", payload);
export const updateDonation = (id: number, payload: DonationPayload) => apiPut(`/blood-donations/${id}`, payload);
export const deleteDonation = (id: number) => apiDelete(`/blood-donations/${id}`);
