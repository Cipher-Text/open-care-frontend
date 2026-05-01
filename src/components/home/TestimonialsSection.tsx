import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
	const testimonials = [
		{
			rating: 5,
			text: "Open Care saved my mother's life during a cardiac emergency. The ambulance arrived in 6 minutes and the medical team was excellent.",
			name: "Rashida Khan, Dhaka",
			type: "Emergency Service Patient",
		},
		{
			rating: 5,
			text: "I consulted with Dr. Ahmed through video call for my diabetes. Very convenient and professional service. Highly recommended!",
			name: "Mohammed Ali, Chittagong",
			type: "Telemedicine Patient",
		},
		{
			rating: 5,
			text: "Found blood donors for my surgery through Open Care's blood bank network. The process was so smooth and efficient.",
			name: "Fatima Begum, Sylhet",
			type: "Blood Bank Service User",
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						What Our Patients Say
					</h2>
					<p className="text-xl text-gray-600">
						Real experiences from real people
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<Card key={index} className="bg-teal-50 border-teal-600">
							<CardContent className="py-6">
								<div className="flex text-yellow-500 mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star key={i} className="w-5 h-5 fill-current" />
									))}
								</div>
								<p className="text-gray-900 mb-4">
									&ldquo;{testimonial.text}&rdquo;
								</p>
								<div>
									<p className="font-bold text-teal-600">
										- {testimonial.name}
									</p>
									<p className="text-xs text-gray-600">{testimonial.type}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
