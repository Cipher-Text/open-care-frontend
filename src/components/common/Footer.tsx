import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-foreground py-12 text-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<h3 className="mb-2 text-xl font-bold">Open Care</h3>
						<p className="text-sm opacity-80">
							A free health directory for Bangladesh. Hospitals, clinics, diagnostic centers, blood banks and
							doctors in every district.
						</p>
					</div>

					<nav aria-label="Directory">
						<h4 className="mb-3 font-bold">Directory</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li><Link href="/hospitals" className="hover:underline">Hospitals and clinics</Link></li>
							<li><Link href="/doctors" className="hover:underline">Doctors</Link></li>
							<li><Link href="/ambulances" className="hover:underline">Ambulance services</Link></li>
							<li><Link href="/hospitals?type=BLOOD_BANK" className="hover:underline">Blood banks</Link></li>
							<li><Link href="/institutions" className="hover:underline">Medical institutions</Link></li>
						</ul>
					</nav>

					<nav aria-label="About and legal">
						<h4 className="mb-3 font-bold">Open Care</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li><Link href="/about" className="hover:underline">About</Link></li>
							<li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
							<li><Link href="/contact" className="hover:underline">Contact</Link></li>
							<li><Link href="/signup" className="hover:underline">For doctors and facilities</Link></li>
							<li><Link href="/privacy" className="hover:underline">Privacy policy</Link></li>
							<li><Link href="/terms" className="hover:underline">Terms of use</Link></li>
							<li>
								<a href="https://hub.opencarebd.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
									Project hub
								</a>
							</li>
						</ul>
					</nav>

					<div>
						<h4 className="mb-3 font-bold">Contact</h4>
						<p className="text-sm opacity-80">
							<a href="mailto:hello@opencarebd.com" className="hover:underline">
								hello@opencarebd.com
							</a>
						</p>
						<p className="mt-1 text-sm opacity-80">Dhaka, Bangladesh</p>
						<p className="mt-4 text-sm font-medium">
							Emergency? Call{" "}
							<a href="tel:999" className="underline">
								999
							</a>
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-background/20 pt-6 text-center text-sm opacity-80">
					© {new Date().getFullYear()} Open Care. Information only, not medical advice. Listings may be
					incomplete or out of date.
				</div>
			</div>
		</footer>
	);
}
