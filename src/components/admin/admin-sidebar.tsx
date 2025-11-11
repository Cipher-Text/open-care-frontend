"use client";

import {
  Settings,
  Home,
  LogOut,
  Bell,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { clientLogout } from "@/lib/auth-client";

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
];

export function AdminSidebar() {
  return (
    <Sidebar variant="inset">
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
              {menuItems.map((item) => (
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/01.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs">admin@opencare.com</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/avatars/01.png" alt="Admin" />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin User</span>
                      <span className="truncate text-xs">
                        admin@opencare.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clientLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
