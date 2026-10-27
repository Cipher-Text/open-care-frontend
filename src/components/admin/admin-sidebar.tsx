"use client";

import { usePermissions } from "@/hooks/use-permissions";

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
  LayoutDashboard,
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

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Admin Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Doctors",
    url: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    title: "Nurses",
    url: "/admin/nurses",
    icon: HeartPulse,
  },
  {
    title: "Profiles",
    url: "/admin/profiles",
    icon: UserCircle,
  },
  {
    title: "Institutions",
    url: "/admin/institutions",
    icon: GraduationCap,
  },
  {
    title: "Hospitals",
    url: "/admin/hospitals",
    icon: Building2,
  },
  {
    title: "Medical Specialities",
    url: "/admin/medical-specialities",
    icon: Brain,
  },
  {
    title: "Medical Tests",
    url: "/admin/medical-tests",
    icon: TestTube,
  },
  {
    title: "Associations",
    url: "/admin/associations",
    icon: Users,
  },
  {
    title: "Social Organizations",
    url: "/admin/social-organizations",
    icon: Heart,
  },
  {
    title: "Ambulances",
    url: "/admin/ambulances",
    icon: Truck,
  },
  {
    title: "Constants",
    url: "/admin/constants",
    icon: Database,
  },
  {
    title: "Geolocation",
    url: "/admin/geolocation",
    icon: MapPin,
  },
  {
    title: "Degrees",
    url: "/admin/degrees",
    icon: GraduationCap,
  },
  {
    title: "Blood Management",
    url: "/admin/blood",
    icon: Droplets,
  },
  {
    title: "Advertisement",
    url: "/admin/advertisement",
    icon: Megaphone,
  },
  {
    title: "Prescriptions",
    url: "/admin/prescriptions",
    icon: FileText,
    permission: "view-prescription",
  },
  {
    title: "My consents",
    url: "/admin/consents",
    icon: ShieldCheck,
  },
  {
    title: "Roles & Permissions",
    url: "/admin/role-permissions",
    icon: ShieldCheck,
    permission: "manage-role-permissions",
  },
];

export function AdminSidebar() {
  const { hasPermission } = usePermissions();
  const visibleItems = menuItems.filter(
    (item) => !("permission" in item) || hasPermission(item.permission as string)
  );

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
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
