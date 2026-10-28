"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Home, ShieldCheck, UserCircle } from "lucide-react";
import { UserMenu } from "@/components/admin/user-menu";
import { cn } from "@/lib/utils";

const LINKS = [
	{ href: "/account", label: "Home", icon: Home },
	{ href: "/account/profile", label: "My profile", icon: UserCircle },
	{ href: "/account/consents", label: "My consents", icon: ShieldCheck },
	{ href: "/account/health", label: "My health", icon: HeartPulse },
];

/** The area for people who use Open Care but do not manage it: patients, and staff of other organisations' accounts. */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
				<div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
					<Link href="/account" className="font-semibold">
						Open Care
					</Link>
					<nav aria-label="Account" className="flex flex-1 items-center gap-1 overflow-x-auto">
						{LINKS.map(({ href, label, icon: Icon }) => {
							const active = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
							return (
								<Link
									key={href}
									href={href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm hover:bg-accent",
										active && "bg-accent font-medium"
									)}
								>
									<Icon className="size-4" aria-hidden="true" />
									{label}
								</Link>
							);
						})}
					</nav>
					<Link href="/hospitals" className="hidden text-sm text-muted-foreground hover:underline sm:block">
						Find a hospital
					</Link>
					<UserMenu />
				</div>
			</header>
			<main className="mx-auto max-w-5xl">{children}</main>
		</div>
	);
}
