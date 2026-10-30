import { apiGet, apiPatch, apiPost, apiPut, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export interface AppNotification {
	id: number;
	type: string;
	title: string;
	body: string;
	/** A path inside the web app, or null. */
	link: string | null;
	createdAt: string;
	readAt: string | null;
}

export interface NotificationPreferences {
	smsEnabled: boolean;
	emailEnabled: boolean;
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export const fetchNotifications = async (page: number, size: number, unreadOnly: boolean): Promise<PageResult<AppNotification>> => {
	const url = buildUrl("/notifications", { page: toWirePage(page), size, unreadOnly });
	return normalizePage(unwrap<WirePage<AppNotification>>(await apiGet(url), "Could not load your notifications"));
};

export const fetchUnreadCount = async (): Promise<number> => {
	const response = await apiGet<{ unread: number }>("/notifications/unread-count");
	return response.ok ? (response.data?.unread ?? 0) : 0;
};

export const markNotificationRead = async (id: number) =>
	unwrap<AppNotification>(await apiPatch(`/notifications/${id}/read`), "Could not mark it as read");

export const markAllNotificationsRead = async () => {
	const response = await apiPost("/notifications/read-all");
	if (!response.ok) throw new Error(response.error || "Could not mark them as read");
};

export const fetchNotificationPreferences = async () =>
	unwrap<NotificationPreferences>(await apiGet("/notifications/preferences"), "Could not load your settings");

export const updateNotificationPreferences = async (body: NotificationPreferences) =>
	unwrap<NotificationPreferences>(await apiPut("/notifications/preferences", body), "Could not save your settings");
