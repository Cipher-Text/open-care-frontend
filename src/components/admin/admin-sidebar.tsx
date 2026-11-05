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
  Salad,
  UserCircle,
} from "lucide-react";
import type { ShellGroup } from "@/components/shell/app-sidebar";

// Icons by rule id; the list itself (what is shown, to whom) is in config/navigation-rules.ts
const ICONS: Record<string, LucideIcon> = {
  dashboard: Home,
  doctors: Stethoscope,
  nurses: HeartPulse,
  nutritionists: Salad,
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

/** The console's menu as groups for the shared side menu: what the person's permissions allow, in the order of the rules. */
export function useConsoleGroups(): ShellGroup[] {
  const { hasPermission, ready } = usePermissions();
  // Nothing is listed until the token has been read, so the menu never flashes entries the person cannot use
  const sections = ready ? groupedMenu(hasPermission) : [];
  return sections.map((section) => ({
    label: section.label,
    items: section.items.map((item) => ({ key: item.id, title: item.title, url: item.url, icon: ICONS[item.id] ?? Home })),
  }));
}
