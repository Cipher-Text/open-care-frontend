"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse, ShieldCheck, UserCircle } from "lucide-react";
import { fetchPendingConsents } from "@/api/consents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountHomePage() {
	const pending = useQuery({ queryKey: ["my-pending-consents"], queryFn: fetchPendingConsents, refetchInterval: 15_000 });
	const waiting = pending.data?.length ?? 0;

	return (
		<div className="space-y-6 p-4 md:p-8">
			<div>
				<h1 className="text-2xl font-semibold">Your Open Care account</h1>
				<p className="text-muted-foreground">Your details, who may write prescriptions for you, and your health readings.</p>
			</div>

			{waiting > 0 && (
				<Link href="/account/consents" className="block rounded-lg border border-primary bg-primary/5 p-4 hover:bg-primary/10">
					<p className="font-medium">
						{waiting === 1 ? "A doctor is" : `${waiting} doctors are`} waiting for your approval
					</p>
					<p className="text-sm text-muted-foreground">Only agree if you are with the doctor right now.</p>
				</Link>
			)}

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{ href: "/account/profile", title: "My profile", text: "Your name, phone and address", icon: UserCircle },
					{ href: "/account/consents", title: "My consents", text: "Approve, decline or take back", icon: ShieldCheck },
					{ href: "/account/health", title: "My health", text: "Your recorded readings", icon: HeartPulse },
				].map(({ href, title, text, icon: Icon }) => (
					<Link key={href} href={href}>
						<Card className="h-full transition-colors hover:border-primary/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Icon className="size-5 text-primary" aria-hidden="true" />
									{title}
								</CardTitle>
								<CardDescription>{text}</CardDescription>
							</CardHeader>
							<CardContent />
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
