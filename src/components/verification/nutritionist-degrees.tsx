"use client";

import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { fetchNutritionistDegrees } from "@/api/nutritionists";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** The degrees a nutritionist lists, beside their documents, so a reviewer can match each certificate to a degree. */
export function NutritionistDegreesCard({ nutritionistId }: { nutritionistId: number }) {
	const degrees = useQuery({ queryKey: ["nutritionist-degrees", nutritionistId], queryFn: () => fetchNutritionistDegrees(nutritionistId), retry: false });
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<GraduationCap className="size-4" aria-hidden="true" />
					Degrees listed
				</CardTitle>
				<CardDescription>What the person says they hold. Check each against a document.</CardDescription>
			</CardHeader>
			<CardContent>
				{degrees.isLoading ? (
					<p className="text-sm text-muted-foreground">Loading</p>
				) : degrees.isError ? (
					<p className="text-sm text-muted-foreground">The degrees could not be loaded.</p>
				) : !degrees.data || degrees.data.length === 0 ? (
					<p className="text-sm text-muted-foreground">No degrees listed.</p>
				) : (
					<ul className="divide-y rounded-md border">
						{degrees.data.map((d, index) => (
							<li key={d.id ?? index} className="p-3 text-sm">
								<span className="block font-medium">{d.degreeName}</span>
								<span className="block text-xs text-muted-foreground">{[d.institutionName, d.passingYear, d.grade].filter(Boolean).join(", ") || "No details"}</span>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
