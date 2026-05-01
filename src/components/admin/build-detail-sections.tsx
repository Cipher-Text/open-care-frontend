"use client";

import { ReactNode } from "react";
import { DetailSection } from "./detail-view";

export interface PropertyConfig {
	label: string;
	value: ReactNode;
	icon?: ReactNode;
}

export interface SectionConfig {
	id: string;
	title: string;
	icon?: ReactNode;
	properties?: PropertyConfig[];
	customContent?: ReactNode;
	emptyMessage?: string;
}

export function buildDetailSections(
	sections: SectionConfig[]
): DetailSection[] {
	return sections.map((section) => {
		let content: ReactNode = undefined;

		if (section.customContent) {
			content = section.customContent;
		} else if (section.properties && section.properties.length > 0) {
			content = (
				<div className="flex flex-wrap gap-6">
					{section.properties.map((prop, index) => (
						<div key={index} className="flex-1 min-w-[250px] space-y-2">
							<label className="text-sm font-medium text-gray-500">
								{prop.label}
							</label>
							<div className="flex items-center gap-2">
								{prop.icon && (
									<span className="text-gray-500">{prop.icon}</span>
								)}
								<div className="text-sm">{prop.value}</div>
							</div>
						</div>
					))}
				</div>
			);
		}

		return {
			id: section.id,
			title: section.title,
			icon: section.icon,
			content,
			emptyMessage: section.emptyMessage || "No data available.",
		};
	});
}
