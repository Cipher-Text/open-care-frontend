"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DetailSection {
	id: string;
	title: string;
	icon?: ReactNode;
	content: ReactNode;
	emptyMessage?: string;
}

interface DetailViewProps {
	sections: DetailSection[];
}

export function DetailView({ sections }: DetailViewProps) {
	return (
		<div className="grid gap-6">
			{sections.map((section) => (
				<Card key={section.id}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{section.icon}
							{section.title}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{section.content || (
							<p className="text-sm text-gray-500">
								{section.emptyMessage || "No data available."}
							</p>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
