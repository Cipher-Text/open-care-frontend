"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyDataAccess, fetchMyDonorViews, type DataAccessKind, type DonorView } from "@/api/data-access";
import { getSelfProfile } from "@/api/profile";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const KIND: Record<DataAccessKind, string> = {
	HEALTH_VITALS: "your health readings",
	PRESCRIPTION: "a prescription",
	PROFILE: "your profile details",
	// these two are about lists and files, not about one person, so they never appear here
	DONOR_LIST: "the blood donor list",
	PRIVATE_FILE: "a private file",
};

const SHOWN: Record<DonorView["contactShown"], string> = {
	NAME_ONLY: "your name and blood group only",
	PHONE: "your name, blood group and phone number",
	ADDRESS: "your name, blood group and address",
	PHONE_ADDRESS: "your name, blood group, phone number and address",
};

/** For a blood donor: who opened the donor list and saw this person's listing. Shown to donors, and to anyone who has been looked at. */
function DonorViews() {
	const [page, setPage] = useState(1);
	const profile = useQuery({ queryKey: ["self-profile"], queryFn: getSelfProfile, staleTime: 5 * 60 * 1000, retry: false });
	const views = useQuery({ queryKey: ["my-donor-views", page], queryFn: () => fetchMyDonorViews(page, 20), retry: false, placeholderData: (previous) => previous });
	const rows = views.data?.content ?? [];
	const totalPages = views.data?.totalPages ?? 0;
	// Nothing to say to someone who is not a donor and was never looked at
	if (!profile.data?.isBloodDonor && rows.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Who looked at my blood donor listing</CardTitle>
				<CardDescription>
					You are on the blood donor list, which Plus and Pro members and Open Care staff can open. Each day someone opens it and your listing is shown, it is recorded here: members by a shortened name, staff only as &quot;Open Care staff&quot;, how many times that day, and what the listing showed of you (your phone and address only if you chose to share them). You can change what you share, or leave the list, under your profile.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{views.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{views.error instanceof Error ? views.error.message : "Could not load who looked at your listing"}</AlertDescription>
					</Alert>
				) : views.isLoading ? (
					<Skeleton className="h-24 w-full" />
				) : rows.length === 0 ? (
					<p className="text-sm text-muted-foreground">Nobody has opened your listing yet.</p>
				) : (
					<ul className="divide-y">
						{rows.map((v) => (
							<li key={v.id} className="py-3 text-sm">
								<p>
									<strong>{v.viewerLabel ?? "An Open Care member"}</strong> saw {SHOWN[v.contactShown] ?? "your listing"}
									{v.times > 1 ? <span className="text-muted-foreground"> ({v.times} times that day)</span> : null}
								</p>
								<p className="text-xs text-muted-foreground">{dateTime(v.lastViewedAt)}</p>
							</li>
						))}
					</ul>
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
	);
}

/** Who opened this person's sensitive data. Using your own data is never listed. */
export default function MyDataAccessPage() {
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["my-data-access", page], queryFn: () => fetchMyDataAccess(page, 20), retry: false, placeholderData: (previous) => previous });
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Who looked at my data</CardTitle>
					<CardDescription>
						Each time a doctor opens one of your prescriptions, or Open Care staff open your profile or health readings, it is recorded here. Staff are shown only as &quot;Open Care staff&quot;. Your own use is not listed. If something looks wrong, write to the address on the contact page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the access log"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">Nobody else has opened your data.</p>
					) : (
						<ul className="divide-y">
							{rows.map((r) => (
								<li key={r.id} className="py-3 text-sm">
									<p>
										<strong>{r.actorLabel}</strong> opened {KIND[r.kind] ?? "your data"}
										{r.detail ? <span className="text-muted-foreground"> ({r.detail})</span> : null}
									</p>
									<p className="text-xs text-muted-foreground">{dateTime(r.date)}</p>
								</li>
							))}
						</ul>
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
			<DonorViews />
		</div>
	);
}
