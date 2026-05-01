import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
	return (
		<div className="min-h-screen bg-slate-50">
			<HeroSection />
			<ServicesSection />
			<HowItWorksSection />
			<WhyChooseUsSection />
			<TestimonialsSection />
			<CTASection />
		</div>
	);
}
