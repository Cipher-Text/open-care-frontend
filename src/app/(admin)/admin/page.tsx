"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, FileText, HeartPulse, Stethoscope, Truck, Upload } from "lucide-react";
import { fetchPendingConsents } from "@/api/consents";
import { fetchCounts, type CountKey } from "@/api/dashboard-counts";
import { AdminHeader } from "@/components/admin/admin-header";
import { SuperAdminDashboard } from "@/components/admin/superadmin-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { groupedMenu, visibleMenu } from "@/config/navigation-rules";
import { usePermissions } from "@/hooks/use-permissions";

const COUNTS: { key: CountKey; label: string; menuId: string; icon: typeof Building2 }[] = [
	{ key: "hospitals", label: "Hospitals and clinics", menuId: "hospitals", icon: Building2 },
	{ key: "doctors", label: "Doctors", menuId: "doctors", icon: Stethoscope },
	{ key: "nurses", label: "Nurses", menuId: "nurses", icon: HeartPulse },
	{ key: "institutions", label: "Institutions", menuId: "institutions", icon: Building2 },
	{ key: "ambulances", label: "Ambulances", menuId: "ambulances", icon: Truck },
];

const ACTIONS: { label: string; href: string; permission: string; icon: typeof Building2 }[] = [
	{ label: "Write a prescription", href: "/admin/prescriptions/new", permission: "create-prescription", icon: FileText },
	{ label: "Add a doctor", href: "/admin/doctors/add", permission: "create-doctor", icon: Stethoscope },
	{ label: "Import doctors from CSV", href: "/admin/doctors/bulk-upload", permission: "create-doctor", icon: Upload },
	{ label: "Add a hospital", href: "/admin/hospitals/add", permission: "create-hospital", icon: Building2 },
	{ label: "Add an institution", href: "/admin/institutions/add", permission: "create-institution", icon: Building2 },
];

/**
 * The one dashboard. Everyone in the console sees real numbers and shortcuts for the work their role can do;
 * the super admin also gets the full system overview below. (It used to show made-up figures.)
 */
export default function AdminHomePage() {
	const { hasPermission, ready } = usePermissions();
	const menu = ready ? new Set(visibleMenu(hasPermission).map((rule) => rule.id)) : new Set<string>();
	const countRows = COUNTS.filter((row) => menu.has(row.menuId));
	const actions = ACTIONS.filter((action) => hasPermission(action.permission));
	// Every role gets a way in to its own areas, even when it has no totals or shortcuts above
	const areas = ready
		? groupedMenu(hasPermission)
				.map((section) => ({ ...section, items: section.items.filter((rule) => rule.id !== "dashboard" && rule.id !== "my-consents") }))
				.filter((section) => section.items.length > 0)
		: [];

	const counts = useQuery({
		queryKey: ["dashboard-counts", countRows.map((r) => r.key).join(",")],
		queryFn: () => fetchCounts(countRows.map((r) => r.key)),
		enabled: ready && countRows.length > 0,
		staleTime: 60_000,
	});
	const pending = useQuery({ queryKey: ["my-pending-consents"], queryFn: fetchPendingConsents, enabled: ready, refetchInterval: 15_000 });
	const waiting = pending.data?.length ?? 0;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Dashboard" description="What you can manage, and how the platform is doing" />

			<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
				{waiting > 0 && (
					<Link href="/admin/consents" className="block rounded-lg border border-primary bg-primary/5 p-4 hover:bg-primary/10">
						<p className="font-medium">{waiting === 1 ? "A doctor is" : `${waiting} doctors are`} waiting for your approval</p>
						<p className="text-sm text-muted-foreground">Only agree if you are with the doctor right now.</p>
					</Link>
				)}

				{countRows.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{countRows.map(({ key, label, icon: Icon, menuId }) => (
							<Link key={key} href={`/admin/${menuId}`}>
								<Card className="h-full transition-colors hover:border-primary/50">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">{label}</CardTitle>
										<Icon className="size-4 text-muted-foreground" aria-hidden="true" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{counts.data?.[key] != null ? counts.data[key]!.toLocaleString() : counts.isLoading ? "..." : "-"}
										</div>
										<p className="text-xs text-muted-foreground">listed on Open Care</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}

				{actions.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Your shortcuts</CardTitle>
							<CardDescription>Based on what your role can do.</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{actions.map(({ label, href, icon: Icon }) => (
								<Link key={href} href={href} className="flex items-center justify-between rounded-md border px-3 py-2.5 text-sm hover:bg-accent">
									<span className="flex items-center gap-2">
										<Icon className="size-4 text-primary" aria-hidden="true" />
										{label}
									</span>
									<ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
								</Link>
							))}
						</CardContent>
					</Card>
				)}

				{areas.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Your areas</CardTitle>
							<CardDescription>The parts of the console your role can work in.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{areas.map((section) => (
								<div key={section.label ?? "top"}>
									<p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{section.label}</p>
									<div className="flex flex-wrap gap-2">
										{section.items.map((rule) => (
											<Link key={rule.id} href={rule.url} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
												{rule.title}
											</Link>
										))}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{hasPermission("view-super-admin-panel") && <SuperAdminDashboard />}
			</div>
		</div>
	);
}
