import { AlertTriangle, BadgeCheck, Flag } from "lucide-react";

const CONTACT = "hello@opencarebd.com";

/** Plain statements about what the directory is and is not. Only things that are true today. */
export default function TrustSection() {
	const items = [
		{
			icon: AlertTriangle,
			title: "Information only",
			text: "Open Care is a directory. It does not give medical advice, diagnose conditions or recommend treatment. In an emergency, call 999.",
		},
		{
			icon: BadgeCheck,
			title: "Verified means checked",
			text: "A verified badge appears only on records that have been reviewed. Listings without it were imported and may be incomplete or out of date, so confirm details by phone before you travel.",
		},
		{
			icon: Flag,
			title: "Help us fix mistakes",
			text: "Wrong phone number, closed facility, missing doctor? Tell us and we will correct it.",
			action: { href: `mailto:${CONTACT}?subject=Incorrect%20information%20on%20Open%20Care`, label: "Report incorrect information" },
		},
	];

	return (
		<section aria-labelledby="trust-title" className="py-14 sm:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<h2 id="trust-title" className="text-2xl font-bold text-foreground sm:text-3xl">
					What you can rely on
				</h2>
				<div className="mt-8 grid gap-6 md:grid-cols-3">
					{items.map(({ icon: Icon, title, text, action }) => (
						<div key={title} className="rounded-xl border bg-card p-6">
							<Icon className="mb-3 size-7 text-primary" aria-hidden="true" />
							<h3 className="text-lg font-semibold text-foreground">{title}</h3>
							<p className="mt-2 text-muted-foreground">{text}</p>
							{action && (
								<a href={action.href} className="mt-4 inline-block font-medium text-primary hover:underline">
									{action.label}
								</a>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
