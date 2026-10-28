"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { groupedMenu } from "@/config/navigation-rules";

import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Home,
  FileText,
  Stethoscope,
  Building2,
  Brain,
  Users,
  Truck,
  TestTube,
  Heart,
  Database,
  MapPin,
  GraduationCap,
  Droplets,
  Megaphone,
  HeartPulse,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Icons by rule id; the list itself (what is shown, to whom) is in config/navigation-rules.ts
const ICONS: Record<string, LucideIcon> = {
  dashboard: Home,
  doctors: Stethoscope,
  nurses: HeartPulse,
  profiles: UserCircle,
  institutions: Building2,
  hospitals: Building2,
  "medical-specialities": Brain,
  "medical-tests": TestTube,
  associations: Users,
  "social-organizations": Heart,
  ambulances: Truck,
  constants: Database,
  geolocation: MapPin,
  degrees: GraduationCap,
  blood: Droplets,
  advertisement: Megaphone,
  prescriptions: FileText,
  "my-consents": ShieldCheck,
  "role-permissions": ShieldCheck,
};

export function AdminSidebar() {
  const { hasPermission, ready } = usePermissions();
  // Nothing is listed until the token has been read, so the menu never flashes entries the person cannot use
  const sections = ready ? groupedMenu(hasPermission) : [];

  return (
    <Sidebar variant="inset" className="print:hidden">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">OpenCare Admin</span>
            <span className="truncate text-xs">Healthcare Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label ?? "top"}>
            {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <Link href={item.url}>
                      <SidebarMenuButton>
                        {(() => {
                          const Icon = ICONS[item.id] ?? Home;
                          return <Icon />;
                        })()}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}
