import { Button } from "@/components/ui/button";
import { Rocket, Phone } from "lucide-react";

export default function CTASection() {
	return (
		<section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800">
			<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
				<h2 className="text-4xl font-bold text-white mb-4">
					Ready to Take Control of Your Health?
				</h2>
				<p className="text-xl text-white mb-8">
					Join thousands of satisfied patients who trust Open Care
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Button
						size="lg"
						className="bg-white text-teal-600 hover:bg-teal-600 hover:text-white"
					>
						<Rocket className="w-4 h-4 mr-2" />
						Get Started Now
					</Button>
					<Button
						size="lg"
						className="bg-teal-600 text-white hover:bg-white hover:text-teal-600"
					>
						<Phone className="w-4 h-4 mr-2" />
						Contact Us
					</Button>
				</div>
			</div>
		</section>
	);
}
