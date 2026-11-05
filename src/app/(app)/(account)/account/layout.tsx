"use client";

import { usePathname } from "next/navigation";
import { Award, Building2, BadgeCheck, CalendarDays, Eye, FileText, HeartPulse, Home, MoreHorizontal, Salad, ShieldCheck, Star, UserCircle, type LucideIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppShell } from "@/components/shell/app-shell";
import type { ShellGroup } from "@/components/shell/app-sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import { organisationHome } from "@/lib/workspaces";

interface NavLink {
	href: string;
	label: string;
	icon: LucideIcon;
	/** Shown only to people who hold this permission. */
	permission?: string;
	/** Shown only to people of this type (their own professional record). */
	userType?: string;
}

/** The account area in groups, so the list stays readable as roles add entries. The same list serves the side menu and the phone's bottom bar. */
const GROUPS: { label: string; links: NavLink[] }[] = [
	{
		label: "Me",
		links: [
			{ href: "/account", label: "Home", icon: Home },
			{ href: "/account/profile", label: "My profile", icon: UserCircle },
			{ href: "/account/consents", label: "My consents", icon: ShieldCheck },
			{ href: "/account/data-access", label: "Who looked", icon: Eye },
		],
	},
	{
		label: "My care",
		links: [
			{ href: "/account/health", label: "My health", icon: HeartPulse },
			{ href: "/account/appointments", label: "Appointments", icon: CalendarDays },
			{ href: "/account/prescriptions", label: "Prescriptions", icon: FileText },
			{ href: "/account/reviews", label: "Reviews", icon: Star },
		],
	},
	{
		label: "Contribute",
		links: [
			{ href: "/account/contributions", label: "Contribute", icon: Award },
			{ href: "/account/verification", label: "Verification", icon: BadgeCheck },
		],
	},
	{
		label: "Professional",
		// by the person's type: the permission is held by hospital admins too, who have no nutritionist record
		links: [
			{ href: "/account/nurse", label: "My nurse profile", icon: HeartPulse, userType: "NURSE" },
			{ href: "/account/nutritionist", label: "My nutritionist profile", icon: Salad, userType: "NUTRITIONIST" },
		],
	},
];

/** The heading of the page: the label of the menu entry it belongs to (the longest address that matches), or a name for the few pages the menu does not list. */
function titleFor(pathname: string, links: NavLink[]): string | null {
	const listed = links
		.filter((link) => pathname === link.href || pathname.startsWith(link.href + "/"))
		.sort((a, b) => b.href.length - a.href.length)[0];
	if (listed) return listed.label;
	// the inbox is the console's page and has its own heading
	if (pathname.startsWith("/account/notifications")) return null;
	return "My account";
}

/**
 * The area for people who use Open Care but do not manage it: patients, professionals looking after their own record, and members of
 * organisations. It is rendered inside the same frame as the console (`AppShell`), so every signed-in person sees one product: the same
 * side menu, top bar and page heading, with a menu made for this area.
 */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { hasPermission, userType, organisations } = usePermissions();
	// each organisation the person belongs to is a place of its own, listed so that members without console access can reach it
	const organisationGroup: { label: string; links: NavLink[] }[] = organisations.length > 0
		? [{ label: "My organisations", links: organisations.map((m) => ({ href: organisationHome(m.kind, m.organisationId), label: m.name, icon: Building2 })) }]
		: [];
	const groups = [...GROUPS, ...organisationGroup]
		.map((group) => ({ ...group, links: group.links.filter((link) => (!link.permission || hasPermission(link.permission)) && (!link.userType || link.userType === userType)) }))
		.filter((group) => group.links.length > 0);
	const all = groups.flatMap((group) => group.links);
	const title = titleFor(pathname, all);
	const shellGroups: ShellGroup[] = groups.map((group) => ({ label: group.label, items: group.links.map((link) => ({ key: link.href, title: link.label, url: link.href, icon: link.icon })) }));

	return (
		<AppShell brandTitle="Open Care" brandSubtitle="My account" groups={shellGroups} exact={["/account"]} notificationsHref="/account/notifications">
			{title && <AdminHeader title={title} />}
			{children}
		</AppShell>
	);
}
