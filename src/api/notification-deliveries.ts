import { apiGet, apiPost, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export type DeliveryStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED";
export type DeliveryChannel = "SMS" | "EMAIL";

export interface Delivery {
	id: number;
	channel: DeliveryChannel;
	status: DeliveryStatus;
	attempts: number;
	lastError: string | null;
	createdAt: string;
	sentAt: string | null;
	nextAttemptAt: string;
	type: string | null;
	recipientProfileId: number | null;
	recipientName: string | null;
}

export interface DeliverySummary {
	days: number;
	rows: { channel: DeliveryChannel; status: DeliveryStatus; total: number }[];
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export const fetchDeliveries = async (filters: { status?: DeliveryStatus | ""; channel?: DeliveryChannel | ""; page: number; size: number }): Promise<PageResult<Delivery>> =>
	normalizePage(
		unwrap<WirePage<Delivery>>(
			await apiGet(buildUrl("/admin/notification-deliveries", { status: filters.status || undefined, channel: filters.channel || undefined, page: toWirePage(filters.page), size: filters.size })),
			"Could not load the queue"
		)
	);

export const fetchDeliverySummary = async (days: number) => unwrap<DeliverySummary>(await apiGet(buildUrl("/admin/notification-deliveries/summary", { days })), "Could not load the summary");

export const retryDelivery = async (id: number) => unwrap<Delivery>(await apiPost(`/admin/notification-deliveries/${id}/retry`), "Could not retry");
