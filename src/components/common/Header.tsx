"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

/** `exact`: highlighted only on its own path (no query), so Hospitals and Blood banks do not both light up. */
const NAV_LINKS: { href: string; label: string; match?: string }[] = [
	{ href: "/hospitals", label: "Hospitals", match: "/hospitals" },
	{ href: "/doctors", label: "Doctors", match: "/doctors" },
	{ href: "/ambulances", label: "Ambulance", match: "/ambulances" },
	{ href: "/hospitals?type=BLOOD_BANK", label: "Blood banks" },
	{ href: "/institutions", label: "Institutions", match: "/institutions" },
];

const MORE_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
	{ href: "/#faq", label: "Help and FAQ" },
	{ href: "/signup", label: "For doctors and facilities" },
];

/** Red emergency pill, always reachable (shown in the bar on every screen size). */
function EmergencyPill({ className }: { className?: string }) {
	return (
		<a
			href="tel:999"
			aria-label="Call 999, the national emergency number"
			className={cn(
				"inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-emergency px-4 text-sm font-semibold text-emergency-foreground hover:opacity-90",
				className
			)}
		>
			<Phone className="size-4" aria-hidden="true" />
			999
		</a>
	);
}

export default function Header() {
	const { isAuthenticated } = useAuth();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const isActive = (match?: string) => !!match && !!pathname?.startsWith(match);

	return (
		<>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
			>
				Skip to content
			</a>
			<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between sm:h-20">
						<Link
							href="/"
							className="flex items-center transition-opacity hover:opacity-80"
							aria-label="Open Care home"
						>
							<Image
								src="/logo.png"
								alt="Open Care"
								width={55}
								height={55}
								className="h-11 w-11 object-contain sm:h-14 sm:w-14"
								priority
							/>
						</Link>

						{/* Desktop navigation */}
						<nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									aria-current={isActive(link.match) ? "page" : undefined}
									className={cn(
										"py-2 text-base font-medium transition-colors hover:text-primary",
										isActive(link.match)
											? "text-primary underline decoration-2 underline-offset-8"
											: "text-muted-foreground"
									)}
								>
									{link.label}
								</Link>
							))}
							<DropdownMenu>
								<DropdownMenuTrigger className="inline-flex items-center gap-1 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary">
									More <ChevronDown className="size-4" aria-hidden="true" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-60">
									{MORE_LINKS.map((link) => (
										<DropdownMenuItem key={link.href} asChild>
											<Link href={link.href}>{link.label}</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</nav>

						{/* Desktop actions */}
						<div className="hidden items-center gap-3 lg:flex">
							<EmergencyPill />
							{isAuthenticated ? (
								<Button asChild>
									<Link href="/admin">Dashboard</Link>
								</Button>
							) : (
								<>
									<Button variant="outline" asChild>
										<Link href="/login">Sign In</Link>
									</Button>
									<Button asChild>
										<Link href="/signup">Get Started</Link>
									</Button>
								</>
							)}
						</div>

						{/* Mobile: emergency pill stays visible next to the menu button */}
						<div className="flex items-center gap-2 lg:hidden">
							<EmergencyPill />
							<Sheet open={open} onOpenChange={setOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="size-11" aria-label="Open menu">
										<Menu className="size-6" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
										<SheetDescription className="sr-only">Site navigation</SheetDescription>
									</SheetHeader>
									<nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
										{NAV_LINKS.map((link) => (
											<SheetClose asChild key={link.label}>
												<Link
													href={link.href}
													aria-current={isActive(link.match) ? "page" : undefined}
													className={cn(
														"flex min-h-12 items-center rounded-md px-3 text-lg font-medium transition-colors hover:bg-accent",
														isActive(link.match) ? "bg-accent text-primary" : "text-foreground"
													)}
												>
													{link.label}
												</Link>
											</SheetClose>
										))}
										<div className="my-2 border-t" role="separator" />
										{MORE_LINKS.map((link) => (
											<SheetClose asChild key={link.href}>
												<Link
													href={link.href}
													className="flex min-h-11 items-center rounded-md px-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
												>
													{link.label}
												</Link>
											</SheetClose>
										))}
									</nav>
									<div className="mt-auto flex flex-col gap-3 p-4">
										{isAuthenticated ? (
											<SheetClose asChild>
												<Button size="lg" asChild>
													<Link href="/admin">Dashboard</Link>
												</Button>
											</SheetClose>
										) : (
											<>
												<SheetClose asChild>
													<Button size="lg" asChild>
														<Link href="/signup">Get Started</Link>
													</Button>
												</SheetClose>
												<SheetClose asChild>
													<Button size="lg" variant="outline" asChild>
														<Link href="/login">Sign In</Link>
													</Button>
												</SheetClose>
											</>
										)}
									</div>
								</SheetContent>
							</Sheet>
						</div>

						
					</div>
				</div>
			</header>
		</>
	);
}
