import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserCheck, Ambulance, Heart, FileText } from "lucide-react";

export default function ServicesSection() {
	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Our Healthcare Services
					</h2>
					<p className="text-xl text-gray-600">
						Comprehensive medical care at your fingertips
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Doctor Consultation */}
					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="w-full h-28 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
								<UserCheck className="w-12 h-12 text-teal-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Doctor Consultation
							</h3>
							<p className="text-gray-600">
								Consult with verified doctors online or book appointments
							</p>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-gray-600 space-y-1 mb-4">
								<li>• 1000+ Specialists</li>
								<li>• Video Consultation</li>
								<li>• Prescription Delivery</li>
							</ul>
							<Button className="w-full bg-teal-600 hover:bg-teal-700 text-sm">
								Book Consultation →
							</Button>
						</CardContent>
					</Card>

					{/* Emergency Ambulance */}
					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="w-full h-28 bg-red-50 rounded-lg flex items-center justify-center mb-4">
								<Ambulance className="w-12 h-12 text-red-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Emergency Ambulance
							</h3>
							<p className="text-gray-600">
								24/7 emergency medical transportation service
							</p>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-gray-600 space-y-1 mb-4">
								<li>• ICU Equipped</li>
								<li>• GPS Tracking</li>
								<li>• Trained Paramedics</li>
							</ul>
							<Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
								Call Ambulance →
							</Button>
						</CardContent>
					</Card>

					{/* Blood Bank */}
					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="w-full h-28 bg-yellow-50 rounded-lg flex items-center justify-center mb-4">
								<Heart className="w-12 h-12 text-yellow-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Blood Bank Services
							</h3>
							<p className="text-gray-600">
								Find blood donors and blood bank locations
							</p>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-gray-600 space-y-1 mb-4">
								<li>• All Blood Types</li>
								<li>• Donor Network</li>
								<li>• Emergency Supply</li>
							</ul>
							<Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-sm">
								Find Blood →
							</Button>
						</CardContent>
					</Card>

					{/* Health Records */}
					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="w-full h-28 bg-green-50 rounded-lg flex items-center justify-center mb-4">
								<FileText className="w-12 h-12 text-green-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Health Records
							</h3>
							<p className="text-gray-600">
								Manage your medical records digitally
							</p>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-gray-600 space-y-1 mb-4">
								<li>• Digital Records</li>
								<li>• Lab Reports</li>
								<li>• Prescription History</li>
							</ul>
							<Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
								Manage Records →
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
