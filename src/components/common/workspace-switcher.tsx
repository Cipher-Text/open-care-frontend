"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/use-permissions";
import { currentWorkspace, workspacesFor } from "@/lib/workspaces";

/**
 * Moves between the places a person works in: their own account, their professional or platform area, and each organisation they
 * belong to. Shown only when there are two or more. It only navigates: what the person may do is decided by the server.
 */
export function WorkspaceSwitcher() {
	const pathname = usePathname();
	const { ready, userType, organisations } = usePermissions();
	if (!ready) return null;
	const list = workspacesFor(userType, organisations);
	if (list.length < 2) return null;
	const current = currentWorkspace(list, pathname);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="max-w-44 justify-between gap-2" aria-label={`Workspace: ${current?.label ?? ""}. Switch workspace`}>
					<span className="truncate">{current?.label}</span>
					<ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="text-xs text-muted-foreground">Switch workspace</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{list.map((w) => (
					<DropdownMenuItem key={w.id} asChild>
						<Link href={w.href} className="flex items-start gap-2">
							<Check className={`mt-0.5 size-4 shrink-0 ${w.id === current?.id ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
							<span className="min-w-0">
								<span className="block truncate text-sm font-medium">{w.label}</span>
								<span className="block truncate text-xs text-muted-foreground">{w.detail}</span>
							</span>
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
