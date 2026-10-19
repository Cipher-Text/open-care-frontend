"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const NAV_LINKS = [
	{ href: "/doctors", label: "Doctors" },
	{ href: "/hospitals", label: "Hospitals" },
];

export default function Header() {
	const { isAuthenticated } = useAuth();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const isActive = (href: string) => pathname?.startsWith(href);

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
						<nav
							className="hidden items-center gap-8 md:flex"
							aria-label="Main"
						>
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									aria-current={isActive(link.href) ? "page" : undefined}
									className={cn(
										"py-2 text-base font-medium transition-colors hover:text-primary",
										isActive(link.href)
											? "text-primary underline decoration-2 underline-offset-8"
											: "text-muted-foreground"
									)}
								>
									{link.label}
								</Link>
							))}
						</nav>

						{/* Desktop actions */}
						<div className="hidden items-center gap-3 md:flex">
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

						{/* Mobile menu */}
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-11 md:hidden"
									aria-label="Open menu"
								>
									<Menu className="size-6" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[85vw] max-w-sm">
								<SheetHeader>
									<SheetTitle>Menu</SheetTitle>
									<SheetDescription className="sr-only">
										Site navigation
									</SheetDescription>
								</SheetHeader>
								<nav
									className="flex flex-col gap-1 px-4"
									aria-label="Mobile"
								>
									{NAV_LINKS.map((link) => (
										<SheetClose asChild key={link.href}>
											<Link
												href={link.href}
												aria-current={isActive(link.href) ? "page" : undefined}
												className={cn(
													"flex min-h-12 items-center rounded-md px-3 text-lg font-medium transition-colors hover:bg-accent",
													isActive(link.href)
														? "bg-accent text-primary"
														: "text-foreground"
												)}
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
			</header>
		</>
	);
}
