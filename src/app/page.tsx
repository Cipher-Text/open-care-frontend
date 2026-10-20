import type { Metadata } from "next";
import BrowseByPlace from "@/components/home/BrowseByPlace";
import EmergencyStrip from "@/components/home/EmergencyStrip";
import FacilityTypes from "@/components/home/FacilityTypes";
import FaqSection, { FAQ_ITEMS } from "@/components/home/FaqSection";
import ForProfessionals from "@/components/home/ForProfessionals";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import { getHomeStats } from "@/lib/public-stats";

// Rebuilt at most once an hour; the numbers come from the API on the server
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Open Care | Hospitals, clinics and doctors in Bangladesh",
	description:
		"Find hospitals, clinics, diagnostic centers, blood banks and doctors in every district of Bangladesh. Free directory, information only.",
	openGraph: {
		title: "Open Care | Hospitals, clinics and doctors in Bangladesh",
		description: "Search health facilities and doctors across Bangladesh by name, district and type.",
		type: "website",
		locale: "en_BD",
	},
};

export default async function Home() {
	const stats = await getHomeStats();

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Open Care",
			description: "Health facility and doctor directory for Bangladesh",
			inLanguage: "en",
		},
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: FAQ_ITEMS.map((i) => ({
				"@type": "Question",
				name: i.q,
				acceptedAnswer: { "@type": "Answer", text: i.a },
			})),
		},
	];

	return (
		<div className="bg-background">
			<HeroSection stats={stats} />
			<EmergencyStrip />
			<FacilityTypes stats={stats} />
			<BrowseByPlace stats={stats} />
			<TrustSection />
			<ForProfessionals />
			<FaqSection />
			<script
				type="application/ld+json"
				// Static, server-built JSON (no user input)
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</div>
	);
}
