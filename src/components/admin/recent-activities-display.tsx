"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Stethoscope,
  HeartPulse,
  Building2,
  Droplets,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";
import { RecentActivity } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivitiesDisplay({ activities }: RecentActivitiesProps) {
  const getEntityConfig = (entityType: string) => {
    switch (entityType) {
      case "DOCTOR":
        return {
          icon: Stethoscope,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "NURSE":
        return {
          icon: HeartPulse,
          color: "text-pink-600",
          bgColor: "bg-pink-50",
        };
      case "PATIENT":
        return {
          icon: User,
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "HOSPITAL":
        return {
          icon: Building2,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
        };
      case "BLOOD_BANK":
        return {
          icon: Droplets,
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: Activity,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: CheckCircle2,
          variant: "default" as const,
          color: "text-green-600",
        };
      case "FAILED":
        return {
          icon: XCircle,
          variant: "destructive" as const,
          color: "text-red-600",
        };
      case "PENDING":
        return {
          icon: Clock,
          variant: "secondary" as const,
          color: "text-yellow-600",
        };
      default:
        return {
          icon: Clock,
          variant: "outline" as const,
          color: "text-gray-600",
        };
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "text-blue-600 bg-blue-50";
      case "LOGOUT":
        return "text-gray-600 bg-gray-50";
      case "REGISTERED":
        return "text-green-600 bg-green-50";
      case "UPDATED":
        return "text-orange-600 bg-orange-50";
      case "DEACTIVATED":
        return "text-red-600 bg-red-50";
      case "DELETED":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Activity className="h-5 w-5 mr-2" />
            <span>No recent activities</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>
          Latest {activities.length} system activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const entityConfig = getEntityConfig(activity.entityType);
            const statusConfig = getStatusConfig(activity.status);
            const EntityIcon = entityConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                {/* Entity Icon */}
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${entityConfig.bgColor}`}
                >
                  <EntityIcon className={`h-4 w-4 ${entityConfig.color}`} />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="font-medium text-xs">
                      {activity.entityType.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={`text-xs ${getActionColor(activity.action)}`}
                    >
                      {activity.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.details}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {activity.userId && (
                      <span className="text-xs">
                        User ID: {activity.userId}
                      </span>
                    )}
                    {activity.ipAddress && (
                      <span className="text-xs">IP: {activity.ipAddress}</span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <Badge variant={statusConfig.variant} className="gap-1">
                    <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                    {activity.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-4 pt-4 border-t text-center">
          <button className="text-sm text-primary hover:underline">
            View all activities →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
