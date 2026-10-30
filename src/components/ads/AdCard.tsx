"use client";

import { useEffect } from "react";
import { baseUrl } from "@/config/config";

export interface AdData {
	id: number;
	title: string;
	content: string | null;
	imageUrl: string | null;
	targetUrl: string | null;
}

/** Counts without waiting and without ever breaking the page; no login, no cookie, no visitor data. */
function count(id: number, kind: "view" | "click") {
	try {
		void fetch(`${baseUrl}/advertisements/${id}/${kind}`, { method: "POST", keepalive: true });
	} catch {
		// counting is best effort
	}
}

/** Only an address on this site or an http(s) link is followed. */
function safeTarget(url: string | null): string | null {
	const value = url?.trim();
	if (!value) return null;
	if (value.startsWith("/") && !value.startsWith("//")) return value;
	return /^https?:\/\//i.test(value) ? value : null;
}

/** One ad, clearly labelled. A view is counted once when it appears, a click when it is followed. */
export default function AdCard({ ad, label }: { ad: AdData; label: string }) {
	useEffect(() => {
		count(ad.id, "view");
	}, [ad.id]);

	const target = safeTarget(ad.targetUrl);
	const body = (
		<div className="flex items-center gap-4">
			{ad.imageUrl && (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={ad.imageUrl} alt="" className="hidden size-20 shrink-0 rounded-md object-cover sm:block" loading="lazy" />
			)}
			<div className="min-w-0">
				<p className="font-semibold">{ad.title}</p>
				{ad.content && <p className="text-sm text-muted-foreground">{ad.content}</p>}
			</div>
		</div>
	);

	return (
		<aside className="mx-auto max-w-5xl px-4 py-6 sm:px-6" aria-label={label}>
			<div className="rounded-lg border bg-card p-4">
				<p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
				{target ? (
					<a href={target} rel="sponsored noopener" target={target.startsWith("/") ? undefined : "_blank"} onClick={() => count(ad.id, "click")} className="block hover:opacity-90">
						{body}
					</a>
				) : (
					body
				)}
			</div>
		</aside>
	);
}
