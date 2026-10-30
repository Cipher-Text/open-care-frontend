"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { rememberLanguageIfUnset } from "@/api/profile";
import { Link, usePathname } from "@/i18n/navigation";
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

/** A link with no `match` is never highlighted, so Hospitals and Blood banks do not both light up. `label` is a message key. */
const NAV_LINKS: { href: string; label: string; match?: string }[] = [
	{ href: "/hospitals", label: "hospitals", match: "/hospitals" },
	{ href: "/doctors", label: "doctors", match: "/doctors" },
	{ href: "/blog", label: "articles", match: "/blog" },
	{ href: "/ambulances", label: "ambulance", match: "/ambulances" },
	{ href: "/hospitals?type=BLOOD_BANK", label: "bloodBanks" },
	{ href: "/institutions", label: "institutions", match: "/institutions" },
];

/** `local`: a public page (gets the /bn prefix in Bangla); the others (sign-up) are outside the language scheme. */
const MORE_LINKS: { href: string; label: string; local: boolean }[] = [
	{ href: "/pricing", label: "pricing", local: true },
	{ href: "/about", label: "about", local: true },
	{ href: "/contact", label: "contact", local: true },
	{ href: "/#faq", label: "faq", local: true },
	{ href: "/signup", label: "professionals", local: false },
];

/** The same page in the other language. The address alone decides the language (no cookie), so this is a plain link. */
function LanguageToggle({ className }: { className?: string }) {
	const t = useTranslations("language");
	const locale = useLocale();
	const { isAuthenticated } = useAuth();
	const pathname = usePathname();
	const [search, setSearch] = useState("");
	useEffect(() => setSearch(window.location.search), [pathname]);

	const target = locale === "bn" ? "en" : "bn";
	// English is the address without a prefix, so a plain link goes straight there (no /en redirect)
	const href = target === "bn" ? `/bn${pathname === "/" ? "" : pathname}${search}` : `${pathname}${search}`;

	return (
		<NextLink
			href={href}
			hrefLang={target}
			lang={target}
			// A signed-in person who switches language and has no message language yet gets the one they switched to
			onClick={() => {
				if (isAuthenticated) void rememberLanguageIfUnset(target);
			}}
			aria-label={t("switchToLabel")}
			className={cn("inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium hover:bg-accent", className)}
		>
			{t("switchTo")}
		</NextLink>
	);
}


/** Red emergency pill, always reachable (shown in the bar on every screen size). */
function EmergencyPill({ className }: { className?: string }) {
	const t = useTranslations("header");
	return (
		<a
			href="tel:999"
			aria-label={t("emergency")}
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
	const t = useTranslations("header");
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
				{t("skip")}
			</a>
			<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between sm:h-20">
						<Link
							href="/"
							className="flex items-center transition-opacity hover:opacity-80"
							aria-label={t("home")}
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
						<nav className="hidden items-center gap-6 lg:flex" aria-label={t("main")}>
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
									{t(`nav.${link.label}`)}
								</Link>
							))}
							<DropdownMenu>
								<DropdownMenuTrigger className="inline-flex items-center gap-1 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary">
									{t("more")} <ChevronDown className="size-4" aria-hidden="true" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-60">
									{MORE_LINKS.map((link) => (
										<DropdownMenuItem key={link.href} asChild>
											{link.local ? <Link href={link.href}>{t(`moreLinks.${link.label}`)}</Link> : <NextLink href={link.href}>{t(`moreLinks.${link.label}`)}</NextLink>}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</nav>

						{/* Desktop actions */}
						<div className="hidden items-center gap-3 lg:flex">
							<EmergencyPill />
							<LanguageToggle />
							{isAuthenticated ? (
								<Button asChild>
									<NextLink href="/admin">{t("dashboard")}</NextLink>
								</Button>
							) : (
								<>
									<Button variant="outline" asChild>
										<NextLink href="/login">{t("signIn")}</NextLink>
									</Button>
									<Button asChild>
										<NextLink href="/signup">{t("getStarted")}</NextLink>
									</Button>
								</>
							)}
						</div>

						{/* Mobile: emergency pill stays visible next to the menu button */}
						<div className="flex items-center gap-2 lg:hidden">
							<EmergencyPill />
							<LanguageToggle className="px-2" />
							<Sheet open={open} onOpenChange={setOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="size-11" aria-label={t("openMenu")}>
										<Menu className="size-6" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
									<SheetHeader>
										<SheetTitle>{t("menu")}</SheetTitle>
										<SheetDescription className="sr-only">{t("siteNavigation")}</SheetDescription>
									</SheetHeader>
									<nav className="flex flex-col gap-1 px-4" aria-label={t("mobile")}>
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
													{t(`nav.${link.label}`)}
												</Link>
											</SheetClose>
										))}
										<div className="my-2 border-t" role="separator" />
										{MORE_LINKS.map((link) => (
											<SheetClose asChild key={link.href}>
												{(() => {
													const Anchor = link.local ? Link : NextLink;
													return (
														<Anchor
															href={link.href}
															className="flex min-h-11 items-center rounded-md px-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
														>
															{t(`moreLinks.${link.label}`)}
														</Anchor>
													);
												})()}
											</SheetClose>
										))}
									</nav>
									<div className="mt-auto flex flex-col gap-3 p-4">
										{isAuthenticated ? (
											<SheetClose asChild>
												<Button size="lg" asChild>
													<NextLink href="/admin">{t("dashboard")}</NextLink>
												</Button>
											</SheetClose>
										) : (
											<>
												<SheetClose asChild>
													<Button size="lg" asChild>
														<NextLink href="/signup">{t("getStarted")}</NextLink>
													</Button>
												</SheetClose>
												<SheetClose asChild>
													<Button size="lg" variant="outline" asChild>
														<NextLink href="/login">{t("signIn")}</NextLink>
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
