export default function Footer() {
	return (
		<footer className="bg-gray-800 text-white py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8">
					{/* Company Info */}
					<div>
						<h3 className="text-xl font-bold mb-4">Open Care</h3>
						<p className="text-gray-400 mb-4">Healthcare Made Simple</p>
						<div className="space-y-2">
							<h4 className="font-bold">Services</h4>
							<div className="space-y-1 text-gray-400 text-sm">
								<p>Doctor Consultation</p>
								<p>Emergency Ambulance</p>
								<p>Blood Bank</p>
								<p>Health Records</p>
							</div>
						</div>
					</div>

					{/* Company Links */}
					<div>
						<h4 className="font-bold mb-4">Company</h4>
						<div className="space-y-1 text-gray-400 text-sm">
							<p>About Us</p>
							<p>Privacy Policy</p>
							<p>Terms of Service</p>
							<p>Contact</p>
						</div>
					</div>

					{/* Support */}
					<div>
						<h4 className="font-bold mb-4">Support</h4>
						<div className="space-y-1 text-gray-400 text-sm">
							<p>Help Center</p>
							<p>Emergency Hotline</p>
							<p>Live Chat</p>
							<p>FAQs</p>
						</div>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="font-bold mb-4">Emergency Hotline</h4>
						<p className="text-2xl font-bold text-teal-600 mb-4">
							+880-1777-999888
						</p>
						<div className="space-y-1 text-gray-400 text-sm">
							<p>📧 support@opencare.com.bd</p>
							<p>📍 Dhaka, Bangladesh</p>
						</div>
						<div className="mt-4">
							<h5 className="font-bold mb-2">Follow Us</h5>
							<div className="flex space-x-2">
								<div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
									<span className="text-xs">f</span>
								</div>
								<div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
									<span className="text-xs">t</span>
								</div>
								<div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
									<span className="text-xs">in</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
					© 2025 Open Care. All rights reserved. | Licensed Healthcare Platform
					| ISO 9001:2015 Certified
				</div>
			</div>
		</footer>
	);
}
