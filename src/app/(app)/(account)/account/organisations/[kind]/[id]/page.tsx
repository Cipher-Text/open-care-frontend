"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Droplets, MessageSquare, Pencil, TrendingUp } from "lucide-react";
import { fetchEnquiries } from "@/api/enquiries";
import { KIND_LABEL, ROLE_LABEL } from "@/api/organisation-roles";
import { HospitalStaffCard } from "@/components/account/hospital-staff-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routeAllowed } from "@/config/navigation-rules";
import { usePermissions } from "@/hooks/use-permissions";
import { qk } from "@/lib/query-keys";
import { ORGANISATION_KINDS } from "@/lib/workspaces";

/**
 * The home of one organisation a person belongs to: who they are there, what they can do for it, and (for a facility) what is waiting.
 * It sits in the account area so that every member can open it; the links into the console appear only when the person may use them.
 */
export default function OrganisationHomePage() {
	const params = useParams<{ kind: string; id: string }>();
	const { ready, organisations, hasPermission } = usePermissions();
	const entry = (Object.entries(ORGANISATION_KINDS) as [keyof typeof KIND_LABEL, (typeof ORGANISATION_KINDS)[keyof typeof ORGANISATION_KINDS]][]).find(([, v]) => v.slug === params.kind);
	const kind = entry?.[0];
	const id = Number(params.id);
	const membership = kind ? organisations.find((m) => m.kind === kind && m.organisationId === id) : undefined;

	const isHospital = kind === "HOSPITAL";
	const enquiries = useQuery({
		queryKey: [...qk.enquiries, "home", id],
		queryFn: () => fetchEnquiries(1, 50),
		enabled: ready && isHospital && !!membership,
		retry: false,
	});

	if (!ready) return <div className="p-4 md:p-8"><Skeleton className="h-40 w-full max-w-3xl" /></div>;
	if (!entry || !membership || !kind) {
		return (
			<div className="p-4 md:p-8">
				<Alert className="max-w-2xl">
					<AlertDescription>You are not part of this organisation. <Link href="/account" className="text-primary hover:underline">Back to your account</Link></AlertDescription>
				</Alert>
			</div>
		);
	}

	const { segment } = entry[1];
	const admin = membership.role === "ADMIN";
	const link = (path: string) => (routeAllowed(path, hasPermission) ? path : null);
	const actions = [
		{ label: "Open the organisation page", text: "How it appears to people", href: link(`/admin/${segment}/${id}/view`), icon: Building2 },
		{ label: "Edit its details", text: "Contact, description and services", href: admin ? link(`/admin/${segment}/${id}`) : null, icon: Pencil },
		...(isHospital
			? [
					{ label: "Page figures", text: "Visits to your page", href: link("/admin/my-figures"), icon: TrendingUp },
					{ label: "Blood requests", text: "Requests and donations", href: admin ? link("/admin/blood") : null, icon: Droplets },
					{ label: "Enquiries", text: "Questions from patients", href: link("/admin/enquiries"), icon: MessageSquare },
			  ]
			: []),
	].filter((a): a is typeof a & { href: string } => a.href !== null);

	const mine = (enquiries.data?.content ?? []).filter((e) => e.hospitalId === id);
	const waiting = mine.filter((e) => e.status === "NEW");

	return (
		<div className="space-y-6 p-4 md:p-8">
			<div>
				<div className="flex flex-wrap items-center gap-2">
					<h1 className="text-2xl font-semibold">{membership.name}</h1>
					<Badge variant={admin ? "default" : "secondary"}>{ROLE_LABEL[membership.role]}</Badge>
				</div>
				<p className="text-muted-foreground">
					{KIND_LABEL[kind]}
					{membership.position ? `, your position: ${membership.position}` : ""}
				</p>
			</div>

			{!admin && (
				<Alert className="max-w-2xl">
					<AlertDescription>You are a member of this organisation. Its administrators manage its details.</AlertDescription>
				</Alert>
			)}

			{isHospital && admin && <HospitalStaffCard hospitalId={id} />}

			{isHospital && (
				<Card className="max-w-3xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<MessageSquare className="size-5 text-primary" aria-hidden="true" />
							Waiting for an answer
						</CardTitle>
						<CardDescription>Questions patients sent to this facility that nobody has marked as handled.</CardDescription>
					</CardHeader>
					<CardContent>
						{enquiries.isLoading ? (
							<p className="text-sm text-muted-foreground">Loading</p>
						) : enquiries.isError ? (
							<p className="text-sm text-muted-foreground">The enquiries could not be loaded.</p>
						) : waiting.length === 0 ? (
							<p className="text-sm text-muted-foreground">Nothing waiting.</p>
						) : (
							<ul className="divide-y rounded-md border">
								{waiting.slice(0, 3).map((e) => (
									<li key={e.id} className="p-3 text-sm">
										<span className="block font-medium">{e.fromName ?? "A patient"}{e.testName ? `, about ${e.testName}` : ""}</span>
										<span className="block text-muted-foreground">{e.message.length > 120 ? `${e.message.slice(0, 120)}...` : e.message}</span>
									</li>
								))}
							</ul>
						)}
						{waiting.length > 3 && <p className="mt-2 text-xs text-muted-foreground">and {waiting.length - 3} more</p>}
					</CardContent>
				</Card>
			)}

			{actions.length > 0 && (
				<div className="grid max-w-3xl gap-3 sm:grid-cols-2">
					{actions.map(({ label, text, href, icon: Icon }) => (
						<Link key={href} href={href} className="flex items-center justify-between gap-3 rounded-lg border p-4 hover:bg-accent">
							<span className="flex items-start gap-3">
								<Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
								<span>
									<span className="block font-medium">{label}</span>
									<span className="block text-sm text-muted-foreground">{text}</span>
								</span>
							</span>
							<ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
