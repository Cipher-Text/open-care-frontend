"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";
import { Alert } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";

interface AlertsDisplayProps {
  alerts: Alert[];
}

export function AlertsDisplay({ alerts }: AlertsDisplayProps) {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeVariant: "destructive" as const,
        };
      case "MEDIUM":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badgeVariant: "default" as const,
        };
      case "LOW":
        return {
          icon: Info,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          badgeVariant: "secondary" as const,
        };
      default:
        return {
          icon: Info,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeVariant: "secondary" as const,
        };
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Info className="h-5 w-5 mr-2" />
            <span>No active alerts</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Alerts</span>
          <Badge variant="outline">{alerts.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`flex gap-3 p-4 rounded-lg border ${
                  config.bgColor
                } ${config.borderColor} ${
                  alert.acknowledged ? "opacity-60" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <Badge
                      variant={config.badgeVariant}
                      className="flex-shrink-0"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(alert.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {alert.category && (
                      <span className="px-2 py-0.5 bg-white rounded-md border">
                        {alert.category}
                      </span>
                    )}
                    {alert.acknowledged && (
                      <span className="text-green-600">✓ Acknowledged</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
