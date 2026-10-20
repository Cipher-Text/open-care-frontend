"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/admin/user-menu";

/**
 * The one top bar for the whole admin area, rendered by the admin layout so every page has the
 * sidebar toggle and the account menu (pages no longer have to remember to include them).
 * Page titles and page actions live in AdminHeader, below this bar.
 */
export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
      <div className="flex-1" />
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      <UserMenu />
    </header>
  );
}
