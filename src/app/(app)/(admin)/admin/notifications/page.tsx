"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	fetchNotificationPreferences,
	fetchNotifications,
	markAllNotificationsRead,
	markNotificationRead,
	updateNotificationPreferences,
	type AppNotification,
} from "@/api/notifications";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

/** The signed-in person's inbox and their text message and email settings. */
export default function NotificationsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [unreadOnly, setUnreadOnly] = useState(false);

	const list = useQuery({ queryKey: ["notifications", page, unreadOnly], queryFn: () => fetchNotifications(page, PAGE_SIZE, unreadOnly), placeholderData: (previous) => previous });
	const preferences = useQuery({ queryKey: ["notification-preferences"], queryFn: fetchNotificationPreferences, retry: false });

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["notifications"] });
		void queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
	};

	const readOne = useMutation({ mutationFn: (id: number) => markNotificationRead(id), onSuccess: refresh });
	const readAll = useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: () => {
			toast.success("All marked as read");
			refresh();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not mark them as read"),
	});
	const savePreferences = useMutation({
		mutationFn: updateNotificationPreferences,
		onSuccess: (saved) => {
			queryClient.setQueryData(["notification-preferences"], saved);
			toast.success("Settings saved");
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
	});

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	const open = (n: AppNotification) => {
		if (!n.readAt) readOne.mutate(n.id);
	};

	return (
		<div className="flex flex-col">
			<AdminHeader title="Notifications" description="Messages about your verification and, later, your bookings">
				<Button variant="outline" size="sm" onClick={() => readAll.mutate()} disabled={readAll.isPending}>
					Mark all as read
				</Button>
			</AdminHeader>
			<div className="space-y-6 p-4 pt-6 md:p-8">
				<Card>
					<CardHeader>
						<CardTitle>Text messages and email</CardTitle>
						<CardDescription>Messages always appear here. You can also get them by text message or email, if your profile has a phone number or email address.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{preferences.isLoading ? (
							<Skeleton className="h-10 w-full" />
						) : preferences.data ? (
							<>
								<label className="flex items-center gap-2 text-sm">
									<input type="checkbox" checked={preferences.data.smsEnabled} disabled={savePreferences.isPending} onChange={(e) => savePreferences.mutate({ ...preferences.data, smsEnabled: e.target.checked })} />
									Send me text messages
								</label>
								<label className="flex items-center gap-2 text-sm">
									<input type="checkbox" checked={preferences.data.emailEnabled} disabled={savePreferences.isPending} onChange={(e) => savePreferences.mutate({ ...preferences.data, emailEnabled: e.target.checked })} />
									Send me email
								</label>
								<p className="text-xs text-muted-foreground">Text messages and email are not switched on for everyone yet; the inbox always works.</p>
							</>
						) : (
							<p className="text-sm text-muted-foreground">Settings are not available right now.</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex-row items-center justify-between space-y-0">
						<CardTitle>Inbox</CardTitle>
						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" checked={unreadOnly} onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }} />
							Unread only
						</label>
					</CardHeader>
					<CardContent>
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load your notifications"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-32 w-full" />
						) : rows.length === 0 ? (
							<p className="text-sm text-muted-foreground">{unreadOnly ? "Nothing unread." : "No notifications yet."}</p>
						) : (
							<ul className="divide-y">
								{rows.map((n) => (
									<li key={n.id} className={`py-3 text-sm ${n.readAt ? "" : "font-medium"}`}>
										<div className="flex items-start justify-between gap-3">
											<div className="space-y-1">
												<p>
													{!n.readAt && <span className="mr-2 inline-block size-2 rounded-full bg-primary" aria-label="Unread" />}
													{n.title}
												</p>
												<p className="font-normal text-muted-foreground">{n.body}</p>
												<p className="text-xs font-normal text-muted-foreground">{dateTime(n.createdAt)}</p>
											</div>
											<div className="flex shrink-0 gap-2">
												{n.link && (
													<Button asChild size="sm" variant="outline" onClick={() => open(n)}>
														<Link href={n.link}>Open</Link>
													</Button>
												)}
												{!n.readAt && (
													<Button size="sm" variant="ghost" onClick={() => open(n)}>
														Mark read
													</Button>
												)}
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
						{totalPages > 1 && (
							<div className="mt-4 flex items-center justify-between text-sm">
								<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
									Newer
								</Button>
								<span className="text-muted-foreground">
									Page {page} of {totalPages}
								</span>
								<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
									Older
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
