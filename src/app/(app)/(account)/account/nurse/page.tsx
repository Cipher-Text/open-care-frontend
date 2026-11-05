"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMyNurse, updateMyNurse } from "@/api/nurses";
import { MyWorkplaces } from "@/components/account/my-workplaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { qk } from "@/lib/query-keys";

/**
 * A nurse's own record. The registration number is shown but not editable: it is what staff verified, so it changes only through
 * a verification request. Name, phone and address are on My profile.
 */
export default function MyNurseProfilePage() {
	const queryClient = useQueryClient();
	const mine = useQuery({ queryKey: [...qk.myNurse], queryFn: fetchMyNurse, retry: false });
	const [form, setForm] = useState<{ startDate: string; description: string } | null>(null);

	useEffect(() => {
		const n = mine.data;
		if (!n || form) return;
		setForm({ startDate: n.startDate ?? "", description: n.description ?? "" });
	}, [mine.data, form]);

	const save = useMutation({
		mutationFn: () => updateMyNurse((mine.data as { id: number }).id, { startDate: (form as { startDate: string }).startDate, description: (form as { description: string }).description.trim() }),
		onSuccess: () => {
			toast.success("Saved");
			queryClient.invalidateQueries({ queryKey: [...qk.myNurse] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
	});

	return (
		<div className="space-y-4 p-4 md:p-8">
			{mine.isLoading && <Skeleton className="h-48 w-full max-w-2xl" />}
			{mine.isError && (
				<Alert className="max-w-2xl">
					<AlertDescription>
						You do not have a nurse profile yet. Find yours in <Link href="/nurses" className="text-primary hover:underline">the list</Link> and claim it, or add it from{" "}
						<Link href="/account/contribute" className="text-primary hover:underline">Contribute</Link>.
					</AlertDescription>
				</Alert>
			)}
			{mine.data && form && (
				<Card className="max-w-2xl">
					<CardHeader>
						<CardTitle className="text-base">My nurse profile</CardTitle>
						<CardDescription>
							{mine.data.isVerified ? "Your profile is verified." : <>Not verified yet: <Link href="/account/verification" className="text-primary hover:underline">ask for verification</Link> with your documents.</>} Your name and contact details are on{" "}
							<Link href="/account/profile" className="text-primary hover:underline">My profile</Link>.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="nurse-bnmc">Registration number (BNMC)</Label>
							<Input id="nurse-bnmc" value={mine.data.bnmcNo ?? ""} readOnly aria-describedby="nurse-bnmc-help" />
							<p id="nurse-bnmc-help" className="text-xs text-muted-foreground">To change it, send a verification request with the new number and your documents.</p>
						</div>
						<div className="space-y-1">
							<Label htmlFor="nurse-start">Practising since</Label>
							<Input id="nurse-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="nurse-about">About</Label>
							<Textarea id="nurse-about" rows={4} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
						</div>
						<Button onClick={() => save.mutate()} disabled={save.isPending}>
							{save.isPending ? "Saving..." : "Save"}
						</Button>
					</CardContent>
				</Card>
			)}
			{mine.data && <MyWorkplaces />}
		</div>
	);
}
