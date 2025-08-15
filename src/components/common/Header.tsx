import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
	return (
		<header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
					>
						<Image
							src="/logo.png"
							alt="Open Care Logo"
							width={55}
							height={55}
							className="object-contain"
						/>
					</Link>

					{/* Navigation */}
					<nav className="hidden lg:flex space-x-8">
						{/* <Link
							href="/services"
							className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold"
						>
							Services
						</Link> */}
						<Link
							href="/doctors"
							className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold"
						>
							Doctors
						</Link>
						<Link
							href="/hospitals"
							className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold"
						>
							Hospitals
						</Link>
						{/* <Link
							href="/ambulance"
							className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold"
						>
							Ambulance
						</Link>
						<Link
							href="/blood-bank"
							className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold"
						>
							Blood Bank
						</Link>
						<Link href="/about" className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold">
							About
						</Link>
						<Link href="/contact" className="text-gray-600 transition-all hover:text-teal-600 hover:font-semibold">
							Contact
						</Link> */}
					</nav>

					{/* Header Actions */}
					<div className="flex space-x-4">
						<Button
							variant="outline"
							className="border-teal-600 text-teal-600 hover:bg-teal-50"
						>
							Sign In
						</Button>
						<Button className="bg-teal-600 hover:bg-teal-700">
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
