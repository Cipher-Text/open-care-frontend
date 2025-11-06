"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Truck,
  Calendar,
  AlertTriangle,
  Cpu,
  HardDrive,
} from "lucide-react";
import { RealTimeStats } from "@/types/dashboard";

interface RealTimeStatsProps {
  data: RealTimeStats;
}

export function RealTimeStatsDisplay({ data }: RealTimeStatsProps) {
  const stats = [
    {
      title: "Online Users",
      value: data.onlineUsers,
      icon: Users,
      color: "text-green-600",
      showProgress: false,
    },
    {
      title: "Active Ambulances",
      value: data.activeAmbulances,
      icon: Truck,
      color: "text-blue-600",
      showProgress: false,
    },
    {
      title: "Pending Appointments",
      value: data.pendingAppointments,
      icon: Calendar,
      color: "text-yellow-600",
      showProgress: false,
    },
    {
      title: "Critical Alerts",
      value: data.criticalAlerts,
      icon: AlertTriangle,
      color: "text-red-600",
      showProgress: false,
    },
    {
      title: "System Load",
      value: `${data.systemLoad.toFixed(1)}%`,
      icon: Cpu,
      color: "text-purple-600",
      showProgress: true,
      progress: data.systemLoad,
    },
    {
      title: "Memory Usage",
      value: `${data.memoryUsage.toFixed(1)}%`,
      icon: HardDrive,
      color: "text-indigo-600",
      showProgress: true,
      progress: data.memoryUsage,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.showProgress && stat.progress !== undefined && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        stat.progress > 80
                          ? "bg-red-500"
                          : stat.progress > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
