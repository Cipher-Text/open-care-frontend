"use client";

import Link from "next/link";
import { qk } from "@/lib/query-keys";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkDuplicates, type DuplicateKind } from "@/api/duplicates";
import { canCheck, hasStrongMatch, recordHref, REASON_LABEL, sortCandidates } from "@/lib/duplicate-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

/**
 * Shown under the name (and number) fields of an add form: existing records that look like the one being typed, so a
 * duplicate is noticed before it is saved. It only looks; the server decides what is refused. A failed check shows nothing
 * (it must never stop someone from filling in the form).
 */
export function SimilarRecords({ type, name, districtId, number }: { type: DuplicateKind; name?: string; districtId?: string | number; number?: string }) {
	// wait for a pause in typing
	const [typed, setTyped] = useState({ name, districtId, number });
	useEffect(() => {
		const timer = setTimeout(() => setTyped({ name, districtId, number }), 500);
		return () => clearTimeout(timer);
	}, [name, districtId, number]);

	const enabled = canCheck(typed.name, typed.number);
	const result = useQuery({
		queryKey: [...qk.duplicateCheck, type, typed.name?.trim(), typed.districtId, typed.number?.trim()],
		queryFn: () => checkDuplicates({ type, name: typed.name?.trim(), districtId: typed.districtId, number: typed.number?.trim() }),
		enabled,
		retry: false,
		staleTime: 30_000,
	});

	const list = result.data ? sortCandidates(result.data) : [];
	if (!enabled || result.isError || list.length === 0) return null;
	const strong = hasStrongMatch(list);

	return (
		<Alert variant={strong ? "destructive" : "default"} className="mt-2">
			<AlertDescription>
				<p className="font-medium">{strong ? "This looks like a record that already exists:" : "Records with a similar name or number:"}</p>
				<ul className="mt-2 space-y-1 text-sm">
					{list.slice(0, 6).map((c) => (
						<li key={`${c.reason}-${c.id}`} className="flex flex-wrap items-center gap-2">
							<Link href={recordHref(c.type, c.id)} target="_blank" rel="noreferrer" className="font-medium underline">
								{c.name || `Record ${c.id}`}
							</Link>
							<span className="text-muted-foreground">{[c.place, c.key].filter(Boolean).join(" · ")}</span>
							<Badge variant={REASON_LABEL[c.reason].strong ? "destructive" : "secondary"}>{REASON_LABEL[c.reason].label}</Badge>
							{c.active === false && <Badge variant="outline">Inactive</Badge>}
						</li>
					))}
				</ul>
				{list.length > 6 && <p className="mt-1 text-xs">and {list.length - 6} more. Open Duplicate check in the menu to see all.</p>}
			</AlertDescription>
		</Alert>
	);
}
