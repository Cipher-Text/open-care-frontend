import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Search,
	Stethoscope,
	Ambulance,
	Building2,
	Pill,
	UserCheck,
} from "lucide-react";

export default function HeroSection() {
	return (
		<section className="bg-gradient-to-br from-teal-50 to-emerald-100 py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Hero Content */}
					<div className="space-y-8">
						<div>
							<h1 className="text-5xl lg:text-6xl font-bold">
								<span className="text-gray-900">Your Health,</span>
								<br />
								<span className="text-teal-600">Our Priority</span>
							</h1>
							<p className="text-xl text-gray-600 mt-6 leading-relaxed">
								Connect with certified doctors, book ambulances,
								<br />
								access blood banks, and manage your healthcare
								<br />
								journey - all in one platform.
							</p>
						</div>

						{/* Stats */}
						<div className="flex flex-wrap gap-4">
							<Card className="w-36 text-center border-teal-600">
								<CardContent className="py-4">
									<div className="text-2xl font-bold text-teal-600">1000+</div>
									<div className="text-xs text-gray-600">Verified Doctors</div>
								</CardContent>
							</Card>
							<Card className="w-36 text-center border-teal-600">
								<CardContent className="py-4">
									<div className="text-2xl font-bold text-teal-600">50K+</div>
									<div className="text-xs text-gray-600">Happy Patients</div>
								</CardContent>
							</Card>
							<Card className="w-36 text-center border-teal-600">
								<CardContent className="py-4">
									<div className="text-2xl font-bold text-teal-600">24/7</div>
									<div className="text-xs text-gray-600">Emergency Service</div>
								</CardContent>
							</Card>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4">
							<Button size="lg" className="bg-teal-600 hover:bg-teal-700">
								<Stethoscope className="w-4 h-4 mr-2" />
								Find a Doctor
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-teal-600 text-teal-600 hover:bg-teal-50"
							>
								<Ambulance className="w-4 h-4 mr-2" />
								Emergency Help
							</Button>
						</div>

						{/* Trust Indicators */}
						<div className="text-sm text-gray-600">
							✓ Government Licensed ✓ ISO Certified ✓ 256-bit SSL Secure ✓ HIPAA
							Compliant
						</div>
					</div>

					{/* Hero Image */}
					<div className="relative">
						<Card className="w-full h-96 border-2 border-teal-600 bg-white">
							<CardContent className="flex items-center justify-center h-full">
								<Building2 className="w-32 h-32 text-teal-600" />
							</CardContent>
						</Card>

						{/* Floating Icons */}
						<div className="absolute -top-4 -left-4 w-12 h-12 bg-teal-50 border border-teal-600 rounded-full flex items-center justify-center">
							<UserCheck className="w-6 h-6 text-teal-600" />
						</div>
						<div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-50 border border-teal-600 rounded-full flex items-center justify-center">
							<Pill className="w-6 h-6 text-teal-600" />
						</div>
						<div className="absolute -bottom-4 -left-4 w-12 h-12 bg-teal-50 border border-teal-600 rounded-full flex items-center justify-center">
							<Stethoscope className="w-6 h-6 text-teal-600" />
						</div>
						<div className="absolute -bottom-4 -right-4 w-12 h-12 bg-teal-50 border border-teal-600 rounded-full flex items-center justify-center">
							<Ambulance className="w-6 h-6 text-teal-600" />
						</div>
					</div>
				</div>

				{/* Search Bar */}
				<div className="mt-12 max-w-2xl">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<Input
							placeholder="Search for doctors, specialists, hospitals..."
							className="pl-12 pr-20 h-14 rounded-full border-2 border-teal-600 text-lg"
						/>
						<Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 hover:bg-teal-700 rounded-full">
							Search
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
