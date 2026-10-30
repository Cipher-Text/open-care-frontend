"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search } from "lucide-react";
import { fetchUnreadCount } from "@/api/notifications";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/admin/user-menu";

/**
 * The one top bar for the whole admin area, rendered by the admin layout so every page has the
 * sidebar toggle and the account menu (pages no longer have to remember to include them).
 * Page titles and page actions live in AdminHeader, below this bar.
 */
export function AdminTopbar() {
  // a quiet poll; a failure just shows no badge
  const { data: unread = 0 } = useQuery({ queryKey: ["unread-notifications"], queryFn: fetchUnreadCount, refetchInterval: 60_000, retry: false });
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
      <div className="flex-1" />
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="relative" asChild aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}>
        <Link href="/admin/notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>
      </Button>
      <UserMenu />
    </header>
  );
}
