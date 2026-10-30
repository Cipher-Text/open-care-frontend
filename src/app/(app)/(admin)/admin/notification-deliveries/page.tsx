"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchDeliveries, fetchDeliverySummary, retryDelivery, type DeliveryChannel, type DeliveryStatus } from "@/api/notification-deliveries";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<DeliveryStatus, string> = {
	PENDING: "Waiting",
	SENT: "Sent",
	FAILED: "Gave up",
	SKIPPED: "Not sent (log only)",
};

/** The text message and email queue: what went out, what failed, and a retry. Message text is never shown. */
export default function NotificationDeliveriesPage() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<DeliveryStatus | "">("FAILED");
	const [channel, setChannel] = useState<DeliveryChannel | "">("");
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["deliveries", status, channel, page], queryFn: () => fetchDeliveries({ status, channel, page, size: PAGE_SIZE }), retry: false, placeholderData: (previous) => previous });
	const summary = useQuery({ queryKey: ["delivery-summary"], queryFn: () => fetchDeliverySummary(7), retry: false });
	const retry = useMutation({
		mutationFn: (id: number) => retryDelivery(id),
		onSuccess: () => {
			toast.success("Back in the queue; the next run sends it");
			void queryClient.invalidateQueries({ queryKey: ["deliveries"] });
			void queryClient.invalidateQueries({ queryKey: ["delivery-summary"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not retry"),
	});

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;
	const total = (s: DeliveryStatus) => (summary.data?.rows ?? []).filter((r) => r.status === s).reduce((n, r) => n + r.total, 0);

	return (
		<div className="flex flex-col">
			<AdminHeader title="Message delivery" description="Text messages and email queued by Open Care" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				{summary.data && (
					<p className="text-sm text-muted-foreground">
						Last {summary.data.days} days: {total("SENT")} sent, {total("FAILED")} gave up, {total("PENDING")} waiting, {total("SKIPPED")} not sent because the provider is log only.
					</p>
				)}
				{summary.data && total("SKIPPED") > 0 && total("SENT") === 0 && (
					<Alert>
						<AlertDescription>No text message or email provider is connected, so nothing has left the server. Messages reach people in their inbox only.</AlertDescription>
					</Alert>
				)}
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="Outcome" value={status} onChange={(e) => { setStatus(e.target.value as DeliveryStatus | ""); setPage(1); }}>
							<option value="">All outcomes</option>
							<option value="FAILED">Gave up</option>
							<option value="PENDING">Waiting</option>
							<option value="SENT">Sent</option>
							<option value="SKIPPED">Not sent (log only)</option>
						</NativeSelect>
					</div>
					<div className="w-full sm:w-40">
						<NativeSelect aria-label="Channel" value={channel} onChange={(e) => { setChannel(e.target.value as DeliveryChannel | ""); setPage(1); }}>
							<option value="">Both</option>
							<option value="SMS">Text message</option>
							<option value="EMAIL">Email</option>
						</NativeSelect>
					</div>
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the queue"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Queued</TableHead>
										<TableHead>For</TableHead>
										<TableHead>Kind</TableHead>
										<TableHead>Channel</TableHead>
										<TableHead>Outcome</TableHead>
										<TableHead>Tries</TableHead>
										<TableHead>Last error</TableHead>
										<TableHead />
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((d) => (
										<TableRow key={d.id}>
											<TableCell className="whitespace-nowrap">{dateTime(d.createdAt)}</TableCell>
											<TableCell>{d.recipientName ?? (d.recipientProfileId ? `Profile #${d.recipientProfileId}` : "Gone")}</TableCell>
											<TableCell>{d.type ? d.type.toLowerCase().replaceAll("_", " ") : "-"}</TableCell>
											<TableCell>{d.channel === "SMS" ? "Text" : "Email"}</TableCell>
											<TableCell>
												<Badge variant={d.status === "FAILED" ? "destructive" : d.status === "SENT" ? "default" : "secondary"}>{STATUS_LABEL[d.status]}</Badge>
											</TableCell>
											<TableCell>{d.attempts}</TableCell>
											<TableCell className="max-w-xs truncate" title={d.lastError ?? ""}>{d.lastError ?? "-"}</TableCell>
											<TableCell className="text-right">
												{(d.status === "FAILED" || d.status === "SKIPPED") && (
													<Button size="sm" variant="outline" disabled={retry.isPending} onClick={() => retry.mutate(d.id)}>Retry</Button>
												)}
											</TableCell>
										</TableRow>
									))}
									{rows.length === 0 && (
										<TableRow>
											<TableCell colSpan={8} className="text-center text-muted-foreground">Nothing in this list.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{totalPages > 1 && (
							<div className="mt-4 flex items-center justify-between text-sm">
								<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Newer</Button>
								<span className="text-muted-foreground">Page {page} of {totalPages}</span>
								<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Older</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
