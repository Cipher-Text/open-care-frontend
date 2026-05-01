"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegistrationTrends } from "@/types/dashboard";
import { Stethoscope, HeartPulse, Building2, Users } from "lucide-react";

interface RegistrationTrendsChartProps {
  data: RegistrationTrends;
}

export function RegistrationTrendsChart({
  data,
}: RegistrationTrendsChartProps) {
  // Find the maximum value across all datasets for scaling
  const maxValue = Math.max(
    ...data.doctors,
    ...data.nurses,
    ...data.hospitals,
    ...data.patients
  );

  const datasets = [
    {
      label: "Doctors",
      data: data.doctors,
      color: "bg-blue-500",
      icon: Stethoscope,
      iconColor: "text-blue-600",
    },
    {
      label: "Nurses",
      data: data.nurses,
      color: "bg-pink-500",
      icon: HeartPulse,
      iconColor: "text-pink-600",
    },
    {
      label: "Hospitals",
      data: data.hospitals,
      color: "bg-indigo-500",
      icon: Building2,
      iconColor: "text-indigo-600",
    },
    {
      label: "Patients",
      data: data.patients,
      color: "bg-green-500",
      icon: Users,
      iconColor: "text-green-600",
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Registration Trends</CardTitle>
        <CardDescription>
          Monthly registration statistics for the past {data.months.length}{" "}
          months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {datasets.map((dataset) => {
            const Icon = dataset.icon;
            const total = dataset.data.reduce((sum, val) => sum + val, 0);
            return (
              <div key={dataset.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${dataset.color}`} />
                <Icon className={`h-4 w-4 ${dataset.iconColor}`} />
                <span className="text-sm font-medium">{dataset.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({total} total)
                </span>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="space-y-6">
          {datasets.map((dataset) => (
            <div key={dataset.label}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium w-20">
                  {dataset.label}
                </span>
                <div className="flex-1 h-12 flex items-end gap-1">
                  {dataset.data.map((value, index) => {
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-1 group"
                      >
                        <div className="relative w-full">
                          <div
                            className={`w-full ${dataset.color} rounded-t transition-all hover:opacity-80 cursor-pointer`}
                            style={{ height: `${height}%`, minHeight: "2px" }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {value}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* X-axis labels */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-20" />
            <div className="flex-1 flex gap-1">
              {data.months.map((month, index) => (
                <div
                  key={index}
                  className="flex-1 text-xs text-center text-muted-foreground transform -rotate-45 origin-top-left"
                  style={{ fontSize: "10px" }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
          {datasets.map((dataset) => {
            const total = dataset.data.reduce((sum, val) => sum + val, 0);
            const average = Math.round(total / dataset.data.length);
            const Icon = dataset.icon;
            return (
              <div key={dataset.label} className="text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1 ${dataset.iconColor}`} />
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-muted-foreground">
                  {dataset.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg: {average}/month
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
