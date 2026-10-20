"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Activity, LogOut, User } from "lucide-react";
import { getSelfProfile } from "@/api/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientLogout, getUserSession } from "@/lib/auth-client";

/** Name and email from the access token, shown until (or if) the profile cannot be loaded. */
function identityFromToken(token?: string | null): { name?: string; email?: string } {
  if (!token) return {};
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
    return {
      name: claims.name ?? claims.preferred_username,
      email: claims.email,
    };
  } catch {
    return {};
  }
}

function initials(name: string): string {
  const parts = name.replace(/^dr\.?\s+/i, "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

/**
 * The single account menu for the admin area (lives in the top bar, which stays visible on
 * mobile where the sidebar is hidden). Shows the signed-in user, not placeholder text.
 */
export function UserMenu() {
  const { data: profile } = useQuery({
    queryKey: ["self-profile"],
    queryFn: getSelfProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  // Read the token after mount: the server has no localStorage, so reading it during the first
  // render would not match the server HTML (hydration mismatch)
  const [fromToken, setFromToken] = useState<{ name?: string; email?: string }>({});
  useEffect(() => {
    setFromToken(identityFromToken(getUserSession()?.access_token));
  }, []);

  const name = profile?.name || fromToken.name || "Account";
  const email = profile?.email || fromToken.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label={`Account menu for ${name}`}
        >
          <Avatar className="h-9 w-9">
            {profile?.photoUrl && <AvatarImage src={profile.photoUrl} alt="" />}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate text-sm font-medium leading-none">{name}</p>
            {email && <p className="truncate text-xs leading-none text-muted-foreground">{email}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profile">
            <User className="mr-2 h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/health">
            <Activity className="mr-2 h-4 w-4" aria-hidden="true" />
            Health
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => clientLogout()}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
