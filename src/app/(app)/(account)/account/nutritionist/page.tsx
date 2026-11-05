"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMyNutritionist, updateNutritionist } from "@/api/nutritionists";
import { MyWorkplaces } from "@/components/account/my-workplaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { qk } from "@/lib/query-keys";
import type { NutritionistInput, NutritionistTitle } from "@/types/nutritionists";

type Form = { name: string; bnName: string; gender: string; title: NutritionistTitle; registrationNo: string; degrees: string; startDate: string; description: string; phone: string; email: string; address: string };

/**
 * A nutritionist's own record. Every field is sent back (the server replaces name, contact and address, so a field left out of the
 * request would be cleared), starting from what is saved.
 */
export default function MyNutritionistPage() {
	const queryClient = useQueryClient();
	const mine = useQuery({ queryKey: [...qk.myNutritionist], queryFn: fetchMyNutritionist, retry: false });
	const [form, setForm] = useState<Form | null>(null);

	useEffect(() => {
		const n = mine.data;
		if (!n || form) return;
		setForm({
			name: n.profile?.name ?? "",
			bnName: n.profile?.bnName ?? "",
			gender: (n.profile?.gender as { value?: string } | null)?.value ?? "",
			title: n.title,
			registrationNo: n.registrationNo ?? "",
			degrees: n.degrees ?? "",
			startDate: n.startDate ?? "",
			description: n.description ?? "",
			phone: n.profile?.phone ?? "",
			email: n.profile?.email ?? "",
			address: n.profile?.address ?? "",
		});
	}, [mine.data, form]);

	const save = useMutation({
		mutationFn: () => {
			const f = form as Form;
			const input: NutritionistInput = {
				name: f.name.trim(), bnName: f.bnName.trim(), gender: f.gender, title: f.title, registrationNo: f.registrationNo.trim(),
				degrees: f.degrees.trim(), startDate: f.startDate, description: f.description.trim(), phone: f.phone.trim(), email: f.email.trim(), address: f.address.trim(),
			};
			return updateNutritionist((mine.data as { id: number }).id, input);
		},
		onSuccess: () => { toast.success("Saved"); queryClient.invalidateQueries({ queryKey: [...qk.myNutritionist] }); },
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
	});

	const set = (key: keyof Form, value: string) => setForm((f) => (f ? { ...f, [key]: value } : f));

	return (
		<div className="space-y-4 p-4 md:p-8">
			{mine.isLoading && <Skeleton className="h-64 w-full max-w-2xl" />}
			{mine.isError && (
				<Alert className="max-w-2xl">
					<AlertDescription>
						You do not have a nutritionist profile yet. Find yours in <Link href="/nutritionists" className="text-primary hover:underline">the list</Link> and claim it, or add it from{" "}
						<Link href="/account/contribute" className="text-primary hover:underline">Contribute</Link>.
					</AlertDescription>
				</Alert>
			)}
			{mine.data && form && (
				<Card className="max-w-2xl">
					<CardHeader>
						<CardTitle className="text-base">My nutritionist profile</CardTitle>
						<CardDescription>
							{mine.data.isVerified ? "Your profile is verified." : <>Not verified yet: <Link href="/account/verification" className="text-primary hover:underline">ask for verification</Link> with your documents.</>} Nutritionists do not prescribe.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{([["name", "Name"], ["bnName", "Name in Bangla"], ["registrationNo", "Registration number (if you have one)"], ["degrees", "Degree or qualification"], ["phone", "Phone"], ["email", "Email"], ["address", "Address"]] as const).map(([key, label]) => (
							<div key={key} className="space-y-1">
								<Label htmlFor={`n-${key}`}>{label}</Label>
								<Input id={`n-${key}`} value={form[key]} onChange={(e) => set(key, e.target.value)} />
							</div>
						))}
						<div className="space-y-1">
							<Label htmlFor="n-title">Title</Label>
							<NativeSelect id="n-title" value={form.title} onChange={(e) => set("title", e.target.value)}>
								<option value="NUTRITIONIST">Nutritionist</option>
								<option value="DIETITIAN">Dietitian</option>
							</NativeSelect>
						</div>
						<div className="space-y-1">
							<Label htmlFor="n-start">Practising since</Label>
							<Input id="n-start" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="n-about">About</Label>
							<Textarea id="n-about" rows={4} maxLength={1000} value={form.description} onChange={(e) => set("description", e.target.value)} />
						</div>
						<Button onClick={() => save.mutate()} disabled={save.isPending || !form.name.trim() || !form.gender}>
							{save.isPending ? "Saving..." : "Save"}
						</Button>
					</CardContent>
				</Card>
			)}
			{mine.data && <MyWorkplaces />}
		</div>
	);
}
