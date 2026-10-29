import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { getPlans } from "@/api/plans";
import { CONTACT_EMAIL } from "@/components/common/InfoPage";
import PageHero from "@/components/common/PageHero";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUDIENCES, audienceById } from "@/config/pricing-plans";
import { buildAudienceView, type PlanView } from "@/lib/pricing-view";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Pricing | Open Care",
	description: "Free, Plus and Pro plans for patients, doctors and hospitals on Open Care. Finding care stays free.",
};

const formatPrice = (price: number): string => (price === 0 ? "BDT 0" : `BDT ${price.toLocaleString("en-US")}`);

const waitlistLink = (audience: string, plan: PlanView) =>
	`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Open Care ${plan.name} plan for ${audience}`)}`;

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ for?: string }> }) {
	const { for: requested } = await searchParams;
	const audience = audienceById(requested);
	// Prices and which features each plan includes come from the API; this page only adds the words
	const plans = await getPlans();
	const view = plans ? buildAudienceView(audience, plans) : null;

	return (
		<div className="min-h-screen bg-muted/50">
			<PageHero title="Pricing" description="Free, Plus and Pro for patients, doctors and hospitals. Finding care stays free." />

			<div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
				<nav aria-label="Who is this for" className="flex justify-center">
					<ul className="inline-flex gap-1 rounded-full border bg-background p-1">
						{AUDIENCES.map((item) => (
							<li key={item.id}>
								<Link
									href={`/pricing?for=${item.id}`}
									aria-current={item.id === audience.id ? "page" : undefined}
									className={cn(
										"inline-flex h-9 items-center rounded-full px-4 text-sm font-medium",
										item.id === audience.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
									)}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="text-center">
					<h2 className="text-2xl font-semibold">{audience.headline}</h2>
					<p className="mx-auto mt-2 flex max-w-2xl items-center justify-center gap-2 text-sm text-muted-foreground">
						<Clock className="size-4 shrink-0" aria-hidden="true" />
						Paid plans are not open yet. Join the waitlist and we will tell you before anything is charged.
					</p>
				</div>

				{!view && (
					<Alert>
						<AlertDescription>Plans and prices are temporarily unavailable. Please try again soon.</AlertDescription>
					</Alert>
				)}

				{view && (
					<>
						<div className="grid gap-6 lg:grid-cols-3">
							{view.plans.map((plan) => (
								<Card key={plan.tier} className={cn("flex flex-col", plan.highlight && "border-primary shadow-md")}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-2xl">{plan.name}</CardTitle>
											{plan.highlight && <Badge>Most popular</Badge>}
										</div>
										<CardDescription>{plan.tagline}</CardDescription>
										{plan.prices ? (
											<ul className="space-y-1 pt-2">
												{plan.prices.map((tier) => (
													<li key={tier.label} className="flex items-baseline justify-between gap-2">
														<span className="text-sm text-muted-foreground">{tier.label}</span>
														<span className="shrink-0 whitespace-nowrap text-xl font-bold">{formatPrice(tier.price)}</span>
													</li>
												))}
											</ul>
										) : (
											<p className="pt-2 text-3xl font-bold">
												{formatPrice(plan.price)}
												{plan.period && <span className="ml-1 text-sm font-normal text-muted-foreground">{plan.period}</span>}
											</p>
										)}
										<p className="text-sm text-muted-foreground">
											<span className="font-medium text-foreground">Best for:</span> {plan.bestFor}
										</p>
									</CardHeader>
									<CardContent className="flex flex-1 flex-col justify-between gap-6">
										<ul className="space-y-2 text-sm">
											{plan.includes && (
												<li className="flex gap-2 font-medium">
													<Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
													{plan.includes}
												</li>
											)}
											{plan.features.map((feature) => (
												<li key={feature.text} className="flex gap-2">
													<Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
													<span>
														{feature.text}
														{feature.roadmap && (
															<Badge variant="outline" className="ml-2 align-middle">
																Roadmap
															</Badge>
														)}
													</span>
												</li>
											))}
										</ul>
										{plan.price === 0 ? (
											<Link
												href="/signup"
												className="inline-flex h-10 w-full items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
											>
												Get started free
											</Link>
										) : (
											<a
												href={waitlistLink(audience.label, plan)}
												className={cn(
													"inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium",
													plan.highlight ? "bg-primary text-primary-foreground hover:opacity-90" : "border hover:bg-accent"
												)}
											>
												Join the {plan.name} waitlist
											</a>
										)}
									</CardContent>
								</Card>
							))}
						</div>

						<Card>
							<CardHeader>
								<CardTitle className="text-xl">Compare plans</CardTitle>
							</CardHeader>
							<CardContent className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<caption className="sr-only">Features of each {audience.label.toLowerCase()} plan</caption>
									<thead>
										<tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
											<th scope="col" className="py-3 pr-4">Feature</th>
											{view.plans.map((plan) => (
												<th key={plan.tier} scope="col" className="py-3 pr-4">{plan.name}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{view.comparison.map((row) => (
											<tr key={row.label} className="border-b last:border-0">
												<th scope="row" className="py-3 pr-4 font-medium">{row.label}</th>
												{row.values.map((value, index) => (
													<td key={index} className="py-3 pr-4 text-muted-foreground">{value}</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>
					</>
				)}

				<p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground">
					Prices are in BDT. Features marked Roadmap are planned and not available yet. Plan names describe what is
					included; they do not rank doctors or hospitals, and a paid plan never changes who is verified. Questions?{" "}
					<a className="text-primary underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
						{CONTACT_EMAIL}
					</a>
					.
				</p>
			</div>
		</div>
	);
}
