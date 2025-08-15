import { Card, CardContent } from "@/components/ui/card";
import {
	Shield,
	Clock,
	DollarSign,
	Smartphone,
	Star,
	CheckCircle,
} from "lucide-react";

export default function WhyChooseUsSection() {
	const features = [
		{
			icon: CheckCircle,
			title: "Verified Professionals",
			desc: "All doctors and medical staff are verified and licensed professionals",
		},
		{
			icon: Shield,
			title: "Secure and Private",
			desc: "Your medical data is encrypted and protected with bank-level security",
		},
		{
			icon: Clock,
			title: "Quick Response",
			desc: "Emergency services with average response time under 10 minutes",
		},
		{
			icon: DollarSign,
			title: "Affordable Care",
			desc: "Transparent pricing with no hidden costs and insurance support",
		},
		{
			icon: Smartphone,
			title: "Easy to Use",
			desc: "User-friendly platform available on web and mobile applications",
		},
		{
			icon: Star,
			title: "Quality Assurance",
			desc: "Continuous monitoring and quality checks for all healthcare services",
		},
	];

	return (
		<section className="py-20 bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Why Choose Open Care?
					</h2>
					<p className="text-xl text-gray-600">
						Trusted by thousands of patients across Bangladesh
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => {
						const IconComponent = feature.icon;
						return (
							<Card
								key={index}
								className="text-center border-teal-600 hover:shadow-lg transition-shadow"
							>
								<CardContent className="py-6">
									<IconComponent className="w-8 h-8 text-teal-600 mx-auto mb-4" />
									<h3 className="text-lg font-bold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-sm">{feature.desc}</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
