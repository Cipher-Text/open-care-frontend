import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-foreground py-12 text-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-3">
					<div>
						<h3 className="mb-2 text-xl font-bold">Open Care</h3>
						<p className="text-sm opacity-80">
							A healthcare directory for Bangladesh.
						</p>
					</div>
					<nav aria-label="Footer">
						<h4 className="mb-3 font-bold">Directory</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li>
								<Link href="/doctors" className="hover:underline">
									Doctors
								</Link>
							</li>
							<li>
								<Link href="/hospitals" className="hover:underline">
									Hospitals
								</Link>
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
					</div>
				</div>
				<div className="mt-10 border-t border-background/20 pt-6 text-center text-sm opacity-80">
					© {new Date().getFullYear()} Open Care. Information only, not medical
					advice.
				</div>
			</div>
		</footer>
	);
}
