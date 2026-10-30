"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** A doctor asks to have their profile verified (a registration check by Open Care staff). The request itself is on the Verification page. */
export function VerificationCard({ verified }: { verified: boolean }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BadgeCheck className="h-5 w-5 text-primary" />
					Verification
				</CardTitle>
				<CardDescription>
					{verified
						? "Your profile is verified. The verified badge is shown on your public page."
						: "Send your registration certificate and Open Care staff will check it. Until then your page shows as not yet verified."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant={verified ? "outline" : "default"} asChild>
					<Link href="/account/verification">{verified ? "See my verification" : "Get verified"}</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
