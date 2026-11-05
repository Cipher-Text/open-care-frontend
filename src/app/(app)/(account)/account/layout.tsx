"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BadgeCheck, CalendarDays, Eye, FileText, HeartPulse, Home, MoreHorizontal, Salad, ShieldCheck, Star, UserCircle, type LucideIcon } from "lucide-react";
import { UserMenu } from "@/components/admin/user-menu";
import { WorkspaceSwitcher } from "@/components/common/workspace-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";

interface NavLink {
	href: string;
	label: string;
	icon: LucideIcon;
	/** Shown only to people who hold this permission. */
	permission?: string;
	/** One of the five places kept in the phone's bottom bar; the rest go under "More". */
	primary?: boolean;
}

/** The account area in groups, so the list stays readable as roles add entries. The same list serves the side menu and the phone's bottom bar. */
const GROUPS: { label: string; links: NavLink[] }[] = [
	{
		label: "Me",
		links: [
			{ href: "/account", label: "Home", icon: Home, primary: true },
			{ href: "/account/profile", label: "My profile", icon: UserCircle },
			{ href: "/account/consents", label: "My consents", icon: ShieldCheck },
			{ href: "/account/data-access", label: "Who looked", icon: Eye },
		],
	},
	{
		label: "My care",
		links: [
			{ href: "/account/health", label: "My health", icon: HeartPulse, primary: true },
			{ href: "/account/appointments", label: "Appointments", icon: CalendarDays, primary: true },
			{ href: "/account/prescriptions", label: "Prescriptions", icon: FileText },
			{ href: "/account/reviews", label: "Reviews", icon: Star },
		],
	},
	{
		label: "Contribute",
		links: [
			{ href: "/account/contributions", label: "Contribute", icon: Award, primary: true },
			{ href: "/account/verification", label: "Verification", icon: BadgeCheck },
		],
	},
	{
		label: "Professional",
		// the permission is the one the nutritionist group holds, for their own record
		links: [{ href: "/account/nutritionist", label: "My nutritionist profile", icon: Salad, permission: "update-nutritionist" }],
	},
];

const isActive = (pathname: string, href: string) => (href === "/account" ? pathname === "/account" : pathname === href || pathname.startsWith(href + "/"));

/**
 * The area for people who use Open Care but do not manage it: patients, professionals looking after their own record, and members
 * of organisations. A grouped side menu on a wide screen and a bottom bar on a phone (five places and "More"), because ten or more
 * tabs in a row do not fit and the later ones were hidden by sideways scrolling.
 */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { hasPermission } = usePermissions();
	const groups = GROUPS.map((group) => ({ ...group, links: group.links.filter((link) => !link.permission || hasPermission(link.permission)) })).filter((group) => group.links.length > 0);
	const all = groups.flatMap((group) => group.links);
	const primary = all.filter((link) => link.primary);
	const more = all.filter((link) => !link.primary);

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
				<div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
					<Link href="/account" className="font-semibold">
						Open Care
					</Link>
					<div className="flex-1" />
					<Link href="/hospitals" className="hidden text-sm text-muted-foreground hover:underline sm:block">
						Find a hospital
					</Link>
					<WorkspaceSwitcher />
					<UserMenu />
				</div>
			</header>

			<div className="mx-auto flex max-w-6xl">
				<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r p-4 lg:block">
					<nav aria-label="Account" className="space-y-5">
						{groups.map((group) => (
							<div key={group.label}>
								<p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.label}</p>
								<ul className="space-y-0.5">
									{group.links.map(({ href, label, icon: Icon }) => {
										const active = isActive(pathname, href);
										return (
											<li key={href}>
												<Link
													href={href}
													aria-current={active ? "page" : undefined}
													className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent", active && "bg-accent font-medium")}
												>
													<Icon className="size-4" aria-hidden="true" />
													{label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						))}
					</nav>
				</aside>
				<main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
			</div>

			<nav aria-label="Account" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:hidden">
				<ul className="mx-auto flex max-w-md items-stretch justify-around">
					{primary.map(({ href, label, icon: Icon }) => {
						const active = isActive(pathname, href);
						return (
							<li key={href} className="flex-1">
								<Link
									href={href}
									aria-current={active ? "page" : undefined}
									className={cn("flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs", active ? "font-medium text-primary" : "text-muted-foreground")}
								>
									<Icon className="size-5" aria-hidden="true" />
									<span className="truncate">{label}</span>
								</Link>
							</li>
						);
					})}
					{more.length > 0 && (
						<li className="flex-1">
							<DropdownMenu>
								<DropdownMenuTrigger className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-xs text-muted-foreground" aria-label="More">
									<MoreHorizontal className="size-5" aria-hidden="true" />
									More
								</DropdownMenuTrigger>
								<DropdownMenuContent side="top" align="end" className="w-56">
									{more.map(({ href, label, icon: Icon }) => (
										<DropdownMenuItem key={href} asChild>
											<Link href={href} className="min-h-10">
												<Icon className="mr-2 size-4" aria-hidden="true" />
												{label}
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					)}
				</ul>
			</nav>
		</div>
	);
}
