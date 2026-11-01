"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Shown inside the signed-in area (account, console, sign-in) when a page fails to render: the layout stays, the page does not. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error("Page error:", error);
	}, [error]);

	return (
		<div role="alert" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
			<h1 className="text-xl font-semibold">Something went wrong</h1>
			<p className="text-sm text-muted-foreground">This page could not be shown. Try again; if it keeps happening, tell us what you were doing.</p>
			{error.digest && <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>}
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button asChild variant="outline">
					<Link href="/account">Go to my account</Link>
				</Button>
			</div>
		</div>
	);
}
