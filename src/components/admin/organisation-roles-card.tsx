"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
	addOrganisationRole,
	fetchOrganisationRoles,
	KIND_LABEL,
	removeOrganisationRole,
	ROLE_LABEL,
	searchOrganisations,
	type OrganisationKind,
	type OrganisationRole,
} from "@/api/organisation-roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { usePermissions } from "@/hooks/use-permissions";

/**
 * A person has one type (doctor, nurse, patient, staff) and any number of organisation roles, one per organisation: the admin of
 * one hospital, a member of another, an association admin. This card lists them and, for staff who may, adds and ends them.
 * Adding or ending a role never changes the person's own type.
 */
export function OrganisationRolesCard({ profileId }: { profileId: number }) {
	const queryClient = useQueryClient();
	const { hasPermission } = usePermissions();
	const canAdd = hasPermission("assign-user-role");
	const canRemove = hasPermission("remove-user-role");
	const key = ["organisation-roles", profileId];

	const roles = useQuery({ queryKey: key, queryFn: () => fetchOrganisationRoles(profileId) });

	const [kind, setKind] = useState<OrganisationKind>("HOSPITAL");
	const [role, setRole] = useState<OrganisationRole>("ADMIN");
	const [text, setText] = useState("");
	const [organisationId, setOrganisationId] = useState("");
	const [position, setPosition] = useState("");

	const found = useQuery({
		queryKey: ["organisation-search", kind, text],
		queryFn: () => searchOrganisations(kind, text),
		enabled: canAdd && text.trim().length >= 2,
		staleTime: 30_000,
	});

	const add = useMutation({
		mutationFn: () => addOrganisationRole(profileId, kind, role, Number(organisationId), position),
		onSuccess: () => {
			toast.success("Role added");
			setText("");
			setOrganisationId("");
			setPosition("");
			queryClient.invalidateQueries({ queryKey: key });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not add the role"),
	});

	const remove = useMutation({
		mutationFn: (m: { kind: OrganisationKind; role: OrganisationRole; organisationId: number }) => removeOrganisationRole(profileId, m.kind, m.role, m.organisationId),
		onSuccess: () => {
			toast.success("Role ended");
			queryClient.invalidateQueries({ queryKey: key });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not end the role"),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Building2 className="h-5 w-5" aria-hidden="true" />
					Organisation roles
				</CardTitle>
				<CardDescription>
					The organisations this person belongs to and their role in each. Their own type (doctor, nurse, patient or staff) does not change.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{roles.isLoading ? (
					<p className="text-sm text-muted-foreground">Loading</p>
				) : roles.isError ? (
					<p role="alert" className="text-sm text-destructive">Could not load the organisations.</p>
				) : roles.data && roles.data.length > 0 ? (
					<ul className="divide-y rounded-md border">
						{roles.data.map((m) => (
							<li key={`${m.kind}-${m.organisationId}`} className="flex flex-wrap items-center justify-between gap-2 p-3">
								<div className="min-w-0">
									<p className="truncate font-medium">{m.name}</p>
									<p className="text-xs text-muted-foreground">
										{KIND_LABEL[m.kind]}
										{m.position ? `, ${m.position}` : ""}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant={m.role === "ADMIN" ? "default" : "secondary"}>{ROLE_LABEL[m.role]}</Badge>
									{canRemove && (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label={`End the role at ${m.name}`}
											disabled={remove.isPending}
											onClick={() => {
												if (window.confirm(`End this person's role at ${m.name}?`)) remove.mutate(m);
											}}
										>
											<Trash2 className="h-4 w-4" aria-hidden="true" />
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-muted-foreground">Not part of any organisation.</p>
				)}

				{canAdd && (
					<form
						className="space-y-3 rounded-md border border-dashed p-3"
						onSubmit={(event) => {
							event.preventDefault();
							if (organisationId) add.mutate();
						}}
					>
						<p className="text-sm font-medium">Add a role</p>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="or-kind">Kind</Label>
								<NativeSelect id="or-kind" value={kind} onChange={(e) => { setKind(e.target.value as OrganisationKind); setOrganisationId(""); }}>
									{(Object.keys(KIND_LABEL) as OrganisationKind[]).map((k) => (
										<option key={k} value={k}>{KIND_LABEL[k]}</option>
									))}
								</NativeSelect>
							</div>
							<div className="space-y-1">
								<Label htmlFor="or-role">Role</Label>
								<NativeSelect id="or-role" value={role} onChange={(e) => setRole(e.target.value as OrganisationRole)}>
									<option value="ADMIN">Admin (manages it)</option>
									<option value="USER">Member</option>
								</NativeSelect>
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor="or-search">Organisation</Label>
							<Input id="or-search" value={text} placeholder="Type at least 2 letters of the name" onChange={(e) => { setText(e.target.value); setOrganisationId(""); }} />
							{text.trim().length >= 2 && (
								<NativeSelect aria-label="Matching organisations" value={organisationId} onChange={(e) => setOrganisationId(e.target.value)}>
									<option value="">{found.isLoading ? "Searching" : found.data && found.data.length > 0 ? "Choose one" : "No match"}</option>
									{found.data?.map((o) => (
										<option key={o.id} value={o.id}>{o.name}</option>
									))}
								</NativeSelect>
							)}
						</div>
						<div className="space-y-1">
							<Label htmlFor="or-position">Position (optional)</Label>
							<Input id="or-position" value={position} placeholder={role === "ADMIN" ? "Administrator" : "Member"} onChange={(e) => setPosition(e.target.value)} />
						</div>
						<Button type="submit" disabled={!organisationId || add.isPending}>
							<Plus className="mr-2 h-4 w-4" aria-hidden="true" />
							{add.isPending ? "Adding" : "Add role"}
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
