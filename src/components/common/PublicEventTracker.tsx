"use client";

import { useEffect } from "react";
import { baseUrl } from "@/config/config";

type Kind = "DOCTOR" | "HOSPITAL";
type EventType = "VIEW" | "CALL" | "DIRECTIONS";

/**
 * Anonymous page counters: tells the API that this doctor or hospital page was viewed, and that its call or directions
 * link was used. Only the kind, the slug and the event type are sent: no cookie, no user, nothing that identifies the
 * visitor. Links opt in with data-track-event="CALL" or "DIRECTIONS". Nothing is sent when the browser says Do Not
 * Track or Global Privacy Control, and a page view is counted once per tab session so a refresh does not inflate it.
 */
export function PublicEventTracker({ kind, slug }: { kind: Kind; slug: string }) {
	useEffect(() => {
		const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
		if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;

		const send = (type: EventType) => {
			fetch(`${baseUrl}/public/events`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type, kind, slug }),
				keepalive: true,
			}).catch(() => {
				// counting must never get in the way of the page
			});
		};

		const viewedKey = `oc_viewed_${kind}_${slug}`;
		try {
			if (!sessionStorage.getItem(viewedKey)) {
				sessionStorage.setItem(viewedKey, "1");
				send("VIEW");
			}
		} catch {
			send("VIEW");
		}

		const onClick = (event: MouseEvent) => {
			const link = (event.target as Element | null)?.closest?.("a[data-track-event]");
			const type = link?.getAttribute("data-track-event");
			if (type === "CALL" || type === "DIRECTIONS") send(type);
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [kind, slug]);

	return null;
}
