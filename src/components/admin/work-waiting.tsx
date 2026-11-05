"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Award } from "lucide-react";
import { fetchContributionQueue } from "@/api/contributions";
import { fetchVerificationQueue } from "@/api/verification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";

/** What is waiting for a platform reviewer: verification requests and proposals nobody has decided yet. Shown only to people who may decide them. */
export function WorkWaiting() {
	const { hasPermission } = usePermissions();
	const canVerify = hasPermission("verify-doctor") || hasPermission("verify-facility");

	const verification = useQuery({
		queryKey: ["work-waiting", "verification"],
		queryFn: () => fetchVerificationQueue({ page: 1, size: 1, status: "PENDING" }),
		enabled: canVerify,
		refetchInterval: 60_000,
		retry: false,
	});
	const contributions = useQuery({
		queryKey: ["work-waiting", "contributions"],
		queryFn: () => fetchContributionQueue({ page: 1, size: 1, status: "PENDING" }),
		enabled: canVerify,
		refetchInterval: 60_000,
		retry: false,
	});
	if (!canVerify) return null;

	const rows = [
		{ href: "/admin/verification", label: "Verification requests", text: "Waiting for a first look", icon: BadgeCheck, query: verification },
		{ href: "/admin/contributions", label: "Contributions", text: "Proposals waiting to be accepted", icon: Award, query: contributions },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Waiting for you</CardTitle>
				<CardDescription>The reviews nobody has started yet.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-3 sm:grid-cols-2">
				{rows.map(({ href, label, text, icon: Icon, query }) => {
					const total = query.data?.totalItems;
					return (
						<Link key={href} href={href} className="flex items-center justify-between gap-3 rounded-lg border p-4 hover:bg-accent">
							<span className="flex items-start gap-3">
								<Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
								<span>
									<span className="block font-medium">{label}</span>
									<span className="block text-sm text-muted-foreground">{text}</span>
								</span>
							</span>
							<span className={`text-2xl font-bold ${total ? "text-primary" : "text-muted-foreground"}`}>{query.isError ? "-" : total ?? "..."}</span>
						</Link>
					);
				})}
			</CardContent>
		</Card>
	);
}
