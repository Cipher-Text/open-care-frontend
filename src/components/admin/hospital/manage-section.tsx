"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Card frame shared by the hospital management panels: title, count, optional Add button. */
export function ManageSection({
	title,
	count,
	icon,
	addLabel,
	onAdd,
	children,
}: {
	title: string;
	count?: number;
	icon: ReactNode;
	addLabel?: string;
	onAdd?: () => void;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{icon}
					{title}
					{count != null && <span className="text-muted-foreground">({count})</span>}
				</CardTitle>
				{onAdd && (
					<Button size="sm" onClick={onAdd}>
						<Plus className="mr-1.5 size-4" aria-hidden="true" />
						{addLabel ?? "Add"}
					</Button>
				)}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export function EmptyRow({ children }: { children: ReactNode }) {
	return <p className="py-2 text-sm text-muted-foreground">{children}</p>;
}
