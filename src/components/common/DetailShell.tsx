import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Page frame for public detail pages: back link, then content. */
export function DetailShell({
	backHref,
	backLabel,
	children,
}: {
	backHref: string;
	backLabel: string;
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
				<Link
					href={backHref}
					className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					{backLabel}
				</Link>
				{children}
			</div>
		</div>
	);
}

export function DetailSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<Card className="gap-0 py-0">
			<CardContent className="space-y-3 p-5 sm:p-6">
				<h2 className="text-lg font-semibold text-foreground">{title}</h2>
				{children}
			</CardContent>
		</Card>
	);
}

export function Fact({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div>
			<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
			<dd className="mt-0.5 text-sm text-foreground">{value}</dd>
		</div>
	);
}

export const NOT_MEDICAL_ADVICE =
	"Listings are information only, collected from public sources and partners. They are not medical advice. Please confirm details with the provider before you travel.";
