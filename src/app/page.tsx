import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<HeroSection />
			<ServicesSection />
			<HowItWorksSection />
			<CTASection />
		</div>
	);
}
