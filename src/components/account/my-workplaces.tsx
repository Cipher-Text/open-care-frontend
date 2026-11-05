"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { endStaffWorkplace, fetchMyWorkplaces, setWorkplaceVisibility } from "@/api/staff-workplaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** The hospitals the signed-in nurse or nutritionist works at, with a way to end a link that is no longer true. */
export function MyWorkplaces() {
	const queryClient = useQueryClient();
	const mine = useQuery({ queryKey: ["my-workplaces"], queryFn: fetchMyWorkplaces, retry: false });
	const end = useMutation({
		mutationFn: (id: number) => endStaffWorkplace(id),
		onSuccess: () => {
			toast.success("Link ended");
			queryClient.invalidateQueries({ queryKey: ["my-workplaces"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not end the link"),
	});

	const visibility = useMutation({
		mutationFn: (v: { id: number; show: boolean }) => setWorkplaceVisibility(v.id, v.show),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-workplaces"] }),
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not change what is shown"),
	});

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Building2 className="size-5 text-primary" aria-hidden="true" />
					Where I work
				</CardTitle>
				<CardDescription>A hospital&apos;s administrator adds you here. Nothing is shown publicly until you choose to. If a link is wrong or out of date, end it.</CardDescription>
			</CardHeader>
			<CardContent>
				{mine.isLoading ? (
					<p className="text-sm text-muted-foreground">Loading</p>
				) : mine.isError ? (
					<p className="text-sm text-muted-foreground">Could not load where you work.</p>
				) : !mine.data || mine.data.length === 0 ? (
					<p className="text-sm text-muted-foreground">No hospital has added you yet. <Link href="/hospitals" className="text-primary hover:underline">Find a hospital</Link></p>
				) : (
					<ul className="divide-y rounded-md border">
						{mine.data.map((w) => (
							<li key={w.id} className="flex items-center justify-between gap-2 p-3 text-sm">
								<span className="min-w-0">
									<span className="block truncate font-medium">{w.hospitalName ?? "Hospital"}</span>
									<span className="block text-xs text-muted-foreground">
										{w.position ? `${w.position}, ` : ""}since {w.startDate}
									</span>
									<span className="mt-1 flex items-center gap-2 text-xs">
										<Checkbox
											id={`show-${w.id}`}
											checked={w.showPublicly}
											disabled={visibility.isPending}
											onCheckedChange={(value) => visibility.mutate({ id: w.id, show: value === true })}
										/>
										<label htmlFor={`show-${w.id}`} className="cursor-pointer py-1">Show this on my public page and the hospital&apos;s page</label>
									</span>
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label={`End my link to ${w.hospitalName ?? "this hospital"}`}
									disabled={end.isPending}
									onClick={() => {
										if (window.confirm(`End your link to ${w.hospitalName ?? "this hospital"}?`)) end.mutate(w.id);
									}}
								>
									<Trash2 className="size-4" aria-hidden="true" />
								</Button>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
