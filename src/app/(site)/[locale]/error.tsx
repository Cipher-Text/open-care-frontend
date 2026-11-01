"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Shown inside the public site (header and footer stay) when a page fails to render, in the visitor's language. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const t = useTranslations("errorPages");
	useEffect(() => {
		console.error("Page error:", error);
	}, [error]);

	return (
		<div role="alert" className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-3 px-4 py-12 text-center">
			<h1 className="text-xl font-semibold">{t("title")}</h1>
			<p className="text-sm text-muted-foreground">{t("body")}</p>
			{error.digest && <p className="text-xs text-muted-foreground">{t("reference", { id: error.digest })}</p>}
			<div className="flex gap-2">
				<Button onClick={reset}>{t("retry")}</Button>
				<Button asChild variant="outline">
					<Link href="/">{t("home")}</Link>
				</Button>
			</div>
		</div>
	);
}
