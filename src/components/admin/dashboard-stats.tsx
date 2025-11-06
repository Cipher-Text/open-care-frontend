"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  HeartPulse,
  Users,
  UserCog,
  Building2,
  GraduationCap,
  Droplets,
  Truck,
  Heart,
  HandHelping,
} from "lucide-react";
import { DashboardOverview } from "@/types/dashboard";

interface DashboardStatsProps {
  data: DashboardOverview;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Doctors",
      value: data.totalDoctors,
      icon: Stethoscope,
      color: "text-blue-600",
    },
    {
      title: "Total Nurses",
      value: data.totalNurses,
      icon: HeartPulse,
      color: "text-pink-600",
    },
    {
      title: "Total Patients",
      value: data.totalPatients,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Admins",
      value: data.totalAdmins,
      icon: UserCog,
      color: "text-purple-600",
    },
    {
      title: "Total Hospitals",
      value: data.totalHospitals,
      icon: Building2,
      color: "text-indigo-600",
    },
    {
      title: "Total Institutions",
      value: data.totalInstitutions,
      icon: GraduationCap,
      color: "text-amber-600",
    },
    {
      title: "Blood Units Available",
      value: data.bloodUnitsAvailable,
      icon: Droplets,
      color: "text-red-600",
    },
    {
      title: "Ambulances Active",
      value: data.ambulancesActive,
      icon: Truck,
      color: "text-orange-600",
    },
    {
      title: "Associations Registered",
      value: data.associationsRegistered,
      icon: Heart,
      color: "text-rose-600",
    },
    {
      title: "Social Organizations",
      value: data.socialOrganizations,
      icon: HandHelping,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
