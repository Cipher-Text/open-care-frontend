"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isStaff, MENU_GROUPS, visibleMenu, type NavRule } from "@/config/navigation-rules";
import { cn } from "@/lib/utils";

interface RoleColumn {
	group: string;
	name: string;
	current: Set<string>;
	saved: Set<string>;
}

/**
 * What each role will see in the menu, worked out from the permissions as they are on screen (including
 * changes not saved yet). A cell that differs from what is saved is outlined, so the effect of a change is
 * visible before it is saved.
 */
export function RoleMenuPreview({ roles }: { roles: RoleColumn[] }) {
	const rows = useMemo(() => {
		const entries = roles.map((role) => ({
			role,
			now: new Set(visibleMenu((p) => role.current.has(p)).map((r) => r.id)),
			before: new Set(visibleMenu((p) => role.saved.has(p)).map((r) => r.id)),
			staffNow: isStaff((p) => role.current.has(p)),
			staffBefore: isStaff((p) => role.saved.has(p)),
		}));
		// Every menu entry, in section order
		const ordered: NavRule[] = visibleMenu(() => true).sort((a, b) => {
			const ga = a.group ? MENU_GROUPS.indexOf(a.group) : -1;
			const gb = b.group ? MENU_GROUPS.indexOf(b.group) : -1;
			return ga - gb;
		});
		return { entries, ordered };
	}, [roles]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">What each role sees in the menu</CardTitle>
				<CardDescription>
					A menu entry is shown to a role that holds any of the permissions listed in{" "}
					<code>config/navigation-rules.ts</code>. People with none of them use the account area instead of the console.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="max-h-[60vh] overflow-auto">
					<table className="w-full border-separate border-spacing-0 text-sm">
						<thead>
							<tr>
								<th className="sticky left-0 top-0 z-20 bg-background px-3 py-2 text-left font-medium">Menu entry</th>
								{rows.entries.map(({ role }) => (
									<th key={role.group} className="sticky top-0 z-10 bg-background px-2 py-2 text-center text-xs font-medium">
										{role.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="sticky left-0 bg-background px-3 py-2 font-medium">Lands in</td>
								{rows.entries.map(({ role, staffNow, staffBefore }) => (
									<td key={role.group} className="px-2 py-2 text-center text-xs">
										<span className={cn("rounded px-1.5 py-0.5", staffNow !== staffBefore && "outline outline-2 outline-warning")}>
											{staffNow ? "Console" : "Account"}
										</span>
									</td>
								))}
							</tr>
							{rows.ordered.map((rule) => (
								<tr key={rule.id} className="border-t">
									<td className="sticky left-0 bg-background px-3 py-1.5">
										{rule.title}
										{rule.group && <span className="ml-2 text-xs text-muted-foreground">{rule.group}</span>}
									</td>
									{rows.entries.map(({ role, now, before }) => {
										const shown = now.has(rule.id);
										const changed = shown !== before.has(rule.id);
										return (
											<td key={role.group} className="px-2 py-1.5 text-center">
												<span
													className={cn(
														"inline-flex size-6 items-center justify-center rounded",
														shown ? "text-primary" : "text-muted-foreground/30",
														changed && "outline outline-2 outline-warning"
													)}
													aria-label={`${role.name}: ${rule.title} ${shown ? "shown" : "hidden"}${changed ? " (changed, not saved)" : ""}`}
												>
													{shown ? <Check className="size-4" aria-hidden="true" /> : "·"}
												</span>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
