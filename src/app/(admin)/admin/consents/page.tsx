"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveConsent, denyConsent, fetchMyGrants, fetchPendingConsents, revokeGrant } from "@/api/consents";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/** The signed-in person's own consent requests and the doctors who currently have their consent. */
export default function MyConsentsPage() {
	const queryClient = useQueryClient();
	const pending = useQuery({ queryKey: ["my-pending-consents"], queryFn: fetchPendingConsents, refetchInterval: 10_000 });
	const grants = useQuery({ queryKey: ["my-grants"], queryFn: fetchMyGrants });
	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["my-pending-consents"] });
		queryClient.invalidateQueries({ queryKey: ["my-grants"] });
	};

	const decide = useMutation({
		mutationFn: ({ id, approve }: { id: number; approve: boolean }) => (approve ? approveConsent(id) : denyConsent(id)),
		onSuccess: (_, v) => {
			toast.success(v.approve ? "Consent given" : "Request declined");
			refresh();
		},
	});
	const revoke = useMutation({
		mutationFn: revokeGrant,
		onSuccess: () => {
			toast.success("Consent taken back");
			refresh();
		},
	});

	return (
		<div className="flex-1">
			<AdminHeader title="My consents" description="Doctors who ask to write a prescription for you need your agreement" />
			<div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
				{(decide.isError || revoke.isError) && (
					<Alert variant="destructive">
						<AlertDescription>{((decide.error ?? revoke.error) as Error).message}</AlertDescription>
					</Alert>
				)}

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Waiting for you</CardTitle>
					</CardHeader>
					<CardContent>
						{pending.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
						{pending.data?.length === 0 && <p className="text-sm text-muted-foreground">No doctor is waiting for your approval.</p>}
						<ul className="divide-y">
							{pending.data?.map((r) => (
								<li key={r.id} className="space-y-2 py-3">
									<p className="font-medium">{r.doctorName ?? "A doctor"} wants to write a prescription for you</p>
									<p className="text-sm text-muted-foreground">
										{[r.doctorBmdcNo ? `BMDC ${r.doctorBmdcNo}` : null, r.doctorSpecializations, `asked ${when(r.requestedAt)}`, `expires ${when(r.expiresAt)}`]
											.filter(Boolean)
											.join(" · ")}
									</p>
									<p className="text-xs text-muted-foreground">Only agree if you are with this doctor right now.</p>
									<div className="flex gap-2">
										<Button size="sm" onClick={() => decide.mutate({ id: r.id, approve: true })} disabled={decide.isPending}>
											Agree
										</Button>
										<Button size="sm" variant="outline" onClick={() => decide.mutate({ id: r.id, approve: false })} disabled={decide.isPending}>
											Decline
										</Button>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Doctors with your consent</CardTitle>
					</CardHeader>
					<CardContent>
						{grants.data?.length === 0 && <p className="text-sm text-muted-foreground">No doctor currently has your consent.</p>}
						<ul className="divide-y">
							{grants.data?.map((g) => (
								<li key={g.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
									<div>
										<p className="font-medium">{g.doctorName ?? "Doctor"}</p>
										<p className="text-sm text-muted-foreground">
											{[g.doctorBmdcNo ? `BMDC ${g.doctorBmdcNo}` : null, "can write prescriptions", `until ${when(g.expiresAt)}`]
												.filter(Boolean)
												.join(" · ")}
										</p>
									</div>
									<Button size="sm" variant="outline" onClick={() => revoke.mutate(g.id)} disabled={revoke.isPending}>
										Take back
									</Button>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
