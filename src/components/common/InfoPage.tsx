import { ReactNode } from "react";
import PageHero from "@/components/common/PageHero";

/** Readable single-column layout for About, Contact, Privacy and Terms. */
export default function InfoPage({
	title,
	description,
	updated,
	children,
}: {
	title: string;
	description?: string;
	updated?: string;
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<PageHero title={title} description={description} />
			<article className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:space-y-1 [&_ul]:text-muted-foreground">
				{updated && <p className="text-sm">Last updated: {updated}</p>}
				{children}
			</article>
		</div>
	);
}

export const CONTACT_EMAIL = "hello@opencarebd.com";
