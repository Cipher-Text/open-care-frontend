import Link from "next/link";
import { Ambulance, ArrowRight, Building2, Heart, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const services = [
	{
		title: "Doctors",
		desc: "Browse doctors by specialty, hospital and availability.",
		icon: Stethoscope,
		href: "/doctors",
		cta: "Browse doctors",
	},
	{
		title: "Hospitals",
		desc: "Filter hospitals by district, upazila, type and organization.",
		icon: Building2,
		href: "/hospitals",
		cta: "Browse hospitals",
	},
	{
		title: "Ambulance",
		desc: "A public ambulance directory is on the way.",
		icon: Ambulance,
		tone: "emergency",
	},
	{
		title: "Blood donation",
		desc: "Donor and requisition listings are on the way.",
		icon: Heart,
		tone: "emergency",
	},
] as const;

export default function ServicesSection() {
	return (
		<section className="bg-background py-14 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-10 text-center sm:mb-14">
					<h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
						What you can find
					</h2>
					<p className="text-lg text-muted-foreground">
						Start with the directory, more services are being added.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{services.map((s) => {
						const Icon = s.icon;
						const live = "href" in s;
						const emergency = "tone" in s;
						const body = (
							<Card
								className={
									live
										? "h-full transition-shadow hover:shadow-lg"
										: "h-full border-dashed bg-muted/40"
								}
							>
								<CardHeader>
									<div
										className={`mb-3 flex h-14 w-14 items-center justify-center rounded-lg ${
											emergency
												? "bg-emergency/10 text-emergency"
												: "bg-primary/10 text-primary"
										}`}
									>
										<Icon className="size-7" aria-hidden="true" />
									</div>
									<h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
										{s.title}
										{!live && <Badge variant="secondary">Coming soon</Badge>}
									</h3>
									<p className="text-muted-foreground">{s.desc}</p>
								</CardHeader>
								{live && (
									<CardContent>
										<span className="inline-flex items-center gap-1 font-medium text-primary">
											{s.cta} <ArrowRight className="size-4" aria-hidden="true" />
										</span>
									</CardContent>
								)}
							</Card>
						);
						return live ? (
							<Link
								key={s.title}
								href={s.href}
								className="rounded-xl focus-visible:outline-2"
							>
								{body}
							</Link>
						) : (
							<div key={s.title}>{body}</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
