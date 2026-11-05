"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Home, type LucideIcon } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

/** One entry of the side menu. */
export interface ShellItem {
	key: string;
	title: string;
	url: string;
	icon: LucideIcon;
}

/** A labelled section of the side menu (a null label is the section at the top, with no heading). */
export interface ShellGroup {
	label: string | null;
	items: ShellItem[];
}

/** An entry is the current one when the address is its address or below it; the first entry of a section ("Home", "Dashboard") only when the address is exactly it. */
export function isCurrent(pathname: string, url: string, exactOnly: boolean): boolean {
	const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
	if (path === url) return true;
	return !exactOnly && path.startsWith(url + "/");
}

/**
 * The one side menu of the web app for people who are signed in: the console and the account area both use it, so they look and
 * work the same. What differs is the heading and the entries, which each area passes in.
 */
export function AppSidebar({ brandTitle, brandSubtitle, groups, exact = [] }: { brandTitle: string; brandSubtitle: string; groups: ShellGroup[]; exact?: string[] }) {
	const pathname = usePathname();
	return (
		<Sidebar variant="inset" className="print:hidden">
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Home className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{brandTitle}</span>
						<span className="truncate text-xs">{brandSubtitle}</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				{groups.map((group) => (
					<SidebarGroup key={group.label ?? "top"}>
						{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => {
									const Icon = item.icon;
									return (
										<SidebarMenuItem key={item.key}>
											<SidebarMenuButton asChild isActive={isCurrent(pathname, item.url, exact.includes(item.url))}>
												<Link href={item.url} aria-current={isCurrent(pathname, item.url, exact.includes(item.url)) ? "page" : undefined}>
													<Icon />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/hospitals">
								<ExternalLink />
								<span>Find a hospital</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
