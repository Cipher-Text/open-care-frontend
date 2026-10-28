"use client";

import { Fragment, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Lock, Search } from "lucide-react";
import { toast } from "sonner";
import {
	fetchRolePermissionAudit,
	fetchRolePermissionMatrix,
	updateRolePermissions,
} from "@/api/role-permissions";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleMenuPreview } from "@/components/admin/role-menu-preview";
import { usePermissions } from "@/hooks/use-permissions";
import { RolePermissionMatrix } from "@/types/role-permissions";

const MANAGE = "manage-role-permissions";
const SUPER_ADMIN_GROUP = "super-admin";

type Tab = "mapping" | "history";
type Overrides = Record<string, Set<string>>;

const sameSet = (a: Set<string>, b: Set<string>) =>
	a.size === b.size && [...a].every((x) => b.has(x));

export default function RolePermissionsPage() {
	const { hasPermission } = usePermissions();
	const [tab, setTab] = useState<Tab>("mapping");

	if (!hasPermission(MANAGE)) {
		return (
			<div className="flex flex-col">
				<AdminHeader title="Roles & Permissions" description="" />
				<div className="p-8 text-muted-foreground">
					You need the {MANAGE} permission to manage roles.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Roles & Permissions"
				description="Choose which permissions each role has. No Keycloak access needed."
			>
				<div className="flex gap-2" role="group" aria-label="View">
					<Button
						variant={tab === "mapping" ? "default" : "outline"}
						aria-pressed={tab === "mapping"}
						onClick={() => setTab("mapping")}
					>
						Mapping
					</Button>
					<Button
						variant={tab === "history" ? "default" : "outline"}
						aria-pressed={tab === "history"}
						onClick={() => setTab("history")}
					>
						History
					</Button>
				</div>
			</AdminHeader>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				{tab === "mapping" ? <MappingTab /> : <HistoryTab />}
			</div>
		</div>
	);
}

function MappingTab() {
	const queryClient = useQueryClient();
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["role-permissions"],
		queryFn: fetchRolePermissionMatrix,
		staleTime: 0,
	});

	const [overrides, setOverrides] = useState<Overrides>({});
	const [filter, setFilter] = useState("");
	const [confirmOpen, setConfirmOpen] = useState(false);

	const serverSet = (group: string) => new Set(data?.mapping[group] ?? []);
	const current = (group: string) => overrides[group] ?? serverSet(group);

	const toggle = (group: string, permission: string) => {
		// Functional update: derive from the latest overrides so rapid clicks never lose a change
		setOverrides((prev) => {
			const next = new Set(prev[group] ?? serverSet(group));
			if (next.has(permission)) next.delete(permission);
			else next.add(permission);
			const copy = { ...prev };
			if (sameSet(next, serverSet(group))) delete copy[group];
			else copy[group] = next;
			return copy;
		});
	};

	const changes = useMemo(() => {
		return Object.entries(overrides).map(([group, desired]) => {
			const base = new Set(data?.mapping[group] ?? []);
			return {
				group,
				role: data?.roles.find((r) => r.group === group),
				added: [...desired].filter((p) => !base.has(p)).sort(),
				removed: [...base].filter((p) => !desired.has(p)).sort(),
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [overrides, data]);
	const changeCount = changes.reduce((n, c) => n + c.added.length + c.removed.length, 0);

	const grouped = useMemo(() => {
		const q = filter.trim().toLowerCase();
		const rows = (data?.permissions ?? []).filter(
			(p) =>
				!q ||
				p.name.toLowerCase().includes(q) ||
				p.displayName.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
		);
		const byCategory = new Map<string, typeof rows>();
		rows.forEach((p) => byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p]));
		return [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [data, filter]);

	const save = useMutation({
		mutationFn: async () => {
			const results: { group: string; ok: boolean; message?: string }[] = [];
			for (const change of changes) {
				try {
					await updateRolePermissions(change.group, [...(overrides[change.group] ?? [])]);
					results.push({ group: change.group, ok: true });
				} catch (e) {
					results.push({ group: change.group, ok: false, message: (e as Error).message });
				}
			}
			return results;
		},
		onSuccess: async (results) => {
			const failed = results.filter((r) => !r.ok);
			setOverrides((prev) => {
				const copy = { ...prev };
				results.filter((r) => r.ok).forEach((r) => delete copy[r.group]);
				return copy;
			});
			setConfirmOpen(false);
			await queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
			await queryClient.invalidateQueries({ queryKey: ["role-permissions-audit"] });
			if (failed.length === 0) {
				toast.success(`Saved changes to ${results.length} role${results.length === 1 ? "" : "s"}`);
			} else {
				failed.forEach((f) => toast.error(`${f.group}: ${f.message}`));
			}
		},
	});

	if (isLoading) return <Skeleton className="h-96 w-full" />;
	if (isError || !data) {
		return (
			<Alert variant="destructive" role="alert">
				<AlertDescription className="flex items-center gap-3">
					{(error as Error)?.message || "Could not load roles and permissions."}
					<Button size="sm" variant="outline" onClick={() => refetch()}>
						Try again
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<>
			<Alert>
				<Info className="h-4 w-4" aria-hidden="true" />
				<AlertDescription>
					Changes apply to users of a role the next time they sign in or their session refreshes.
					Every change is recorded under History.
				</AlertDescription>
			</Alert>

			<div className="relative max-w-sm">
				<Search
					className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					type="search"
					aria-label="Filter permissions"
					placeholder="Filter permissions"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="pl-9"
				/>
			</div>

			<Card>
				<CardContent className="p-0">
					<div className="max-h-[65vh] overflow-auto rounded-md">
						<table className="w-full border-separate border-spacing-0 text-sm">
							<thead>
								<tr>
									<th className="sticky left-0 top-0 z-30 min-w-64 border-b bg-background p-3 text-left font-medium">
										Permission
									</th>
									{data.roles.map((role) => (
										<th
											key={role.group}
											scope="col"
											title={role.userType}
											className={`sticky top-0 z-20 min-w-24 border-b bg-background p-2 text-center text-xs font-medium ${
												overrides[role.group] ? "text-primary" : ""
											}`}
										>
											{role.name}
											{overrides[role.group] && <span className="sr-only"> (unsaved changes)</span>}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{grouped.length === 0 && (
									<tr>
										<td colSpan={data.roles.length + 1} className="p-6 text-center text-muted-foreground">
											No permissions match your filter.
										</td>
									</tr>
								)}
								{grouped.map(([category, permissions]) => (
									<Fragment key={category}>
										<tr>
											<th
												colSpan={data.roles.length + 1}
												scope="colgroup"
												className="sticky left-0 bg-muted/60 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
											>
												{category}
											</th>
										</tr>
										{permissions.map((permission) => (
											<tr key={permission.name} className="hover:bg-muted/30">
												<th
													scope="row"
													className="sticky left-0 z-10 border-b bg-background p-3 text-left font-normal"
												>
													<div className="font-medium">{permission.displayName}</div>
													<code className="text-xs text-muted-foreground">{permission.name}</code>
												</th>
												{data.roles.map((role) => {
													const checked = current(role.group).has(permission.name);
													const changed = checked !== serverSet(role.group).has(permission.name);
													const locked =
														role.group === SUPER_ADMIN_GROUP && permission.name === MANAGE;
													return (
														<td
															key={role.group}
															className={`border-b p-2 text-center ${changed ? "bg-primary/10" : ""}`}
														>
															{locked ? (
																<span title="The super admin role must keep this permission" className="inline-flex">
																	<Lock className="size-4 text-muted-foreground" aria-hidden="true" />
																	<span className="sr-only">
																		{role.name}: {permission.displayName}, locked on
																	</span>
																</span>
															) : (
																<Checkbox
																	checked={checked}
																	onCheckedChange={() => toggle(role.group, permission.name)}
																	aria-label={`${role.name}: ${permission.displayName}`}
																/>
															)}
														</td>
													);
												})}
											</tr>
										))}
									</Fragment>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
				<span className="text-sm text-muted-foreground" aria-live="polite">
					{changeCount === 0
						? "No unsaved changes"
						: `${changeCount} unsaved change${changeCount === 1 ? "" : "s"} in ${changes.length} role${
								changes.length === 1 ? "" : "s"
						  }`}
				</span>
				<div className="flex gap-2">
					<Button variant="outline" disabled={changeCount === 0 || save.isPending} onClick={() => setOverrides({})}>
						Discard
					</Button>
					<Button disabled={changeCount === 0 || save.isPending} onClick={() => setConfirmOpen(true)}>
						Review and save
					</Button>
				</div>
			</div>

			<RoleMenuPreview
				roles={data.roles.map((role) => ({
					group: role.group,
					name: role.name,
					current: current(role.group),
					saved: serverSet(role.group),
				}))}
			/>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				changes={changes}
				saving={save.isPending}
				onConfirm={() => save.mutate()}
				matrix={data}
			/>
		</>
	);
}

function ConfirmDialog({
	open,
	onOpenChange,
	changes,
	saving,
	onConfirm,
	matrix,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	changes: { group: string; role?: { name: string }; added: string[]; removed: string[] }[];
	saving: boolean;
	onConfirm: () => void;
	matrix: RolePermissionMatrix;
}) {
	const label = (name: string) => matrix.permissions.find((p) => p.name === name)?.displayName ?? name;
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Save permission changes?</DialogTitle>
					<DialogDescription>
						These changes are written to Keycloak now and take effect at each user&apos;s next sign-in.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-80 space-y-4 overflow-auto text-sm">
					{changes.map((c) => (
						<div key={c.group}>
							<div className="mb-1 font-medium">{c.role?.name ?? c.group}</div>
							<ul className="space-y-1">
								{c.added.map((p) => (
									<li key={p} className="flex items-center gap-2">
										<Badge className="bg-success/15 text-success" variant="outline">Grant</Badge>
										{label(p)}
									</li>
								))}
								{c.removed.map((p) => (
									<li key={p} className="flex items-center gap-2">
										<Badge className="bg-destructive/10 text-destructive" variant="outline">Revoke</Badge>
										{label(p)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
						Cancel
					</Button>
					<Button onClick={onConfirm} disabled={saving}>
						{saving ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function HistoryTab() {
	const [page, setPage] = useState(1);
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["role-permissions-audit", page],
		queryFn: () => fetchRolePermissionAudit(page),
		placeholderData: keepPreviousData,
	});

	if (isLoading) return <Skeleton className="h-64 w-full" />;
	if (isError || !data) {
		return (
			<Alert variant="destructive" role="alert">
				<AlertDescription>{(error as Error)?.message || "Could not load history."}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card>
			<CardContent className="space-y-4 pt-6">
				{data.content.length === 0 ? (
					<p className="text-muted-foreground">No changes have been recorded yet.</p>
				) : (
					<div className="overflow-auto rounded-md border">
						<table className="w-full text-sm">
							<thead className="bg-muted/50 text-left">
								<tr>
									<th className="p-3 font-medium">When</th>
									<th className="p-3 font-medium">Who</th>
									<th className="p-3 font-medium">Role</th>
									<th className="p-3 font-medium">Change</th>
									<th className="p-3 font-medium">Permission</th>
								</tr>
							</thead>
							<tbody>
								{data.content.map((e) => (
									<tr key={e.id} className="border-t">
										<td className="p-3 whitespace-nowrap">{new Date(e.changedAt).toLocaleString()}</td>
										<td className="p-3">{e.changedBy}</td>
										<td className="p-3">{e.group}</td>
										<td className="p-3">
											<Badge
												variant="outline"
												className={e.action === "GRANT" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}
											>
												{e.action === "GRANT" ? "Granted" : "Revoked"}
											</Badge>
										</td>
										<td className="p-3"><code className="text-xs">{e.permission}</code></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{data.totalPages > 1 && (
					<div className="flex items-center justify-between">
						<Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {data.currentPage} of {data.totalPages}
						</span>
						<Button variant="outline" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
							Next
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
