export default function HowItWorksSection() {
	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						How Open Care Works
					</h2>
					<p className="text-xl text-gray-600">
						Getting healthcare has never been this simple
					</p>
				</div>

				<div className="grid md:grid-cols-4 gap-8">
					{/* Step 1 */}
					<div className="text-center">
						<div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">1</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Choose Service
						</h3>
						<p className="text-gray-600">
							Select from doctors, ambulance, or blood bank
						</p>
					</div>

					{/* Step 2 */}
					<div className="text-center">
						<div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">2</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Book and Pay
						</h3>
						<p className="text-gray-600">
							Schedule appointment and make secure payment
						</p>
					</div>

					{/* Step 3 */}
					<div className="text-center">
						<div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">3</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">Get Care</h3>
						<p className="text-gray-600">Receive quality healthcare service</p>
					</div>

					{/* Step 4 */}
					<div className="text-center">
						<div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">4</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">Follow Up</h3>
						<p className="text-gray-600">
							Access records and continue your care
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
