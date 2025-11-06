"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RealTimeStatsDisplay } from "@/components/admin/realtime-stats";
import { AlertsDisplay } from "@/components/admin/alerts-display";
import { RegistrationTrendsChart } from "@/components/admin/registration-trends-chart";
import { RecentActivitiesDisplay } from "@/components/admin/recent-activities-display";
import {
  getDashboardOverview,
  getRealTimeStats,
  getDashboardAlerts,
  getRegistrationTrends,
  getRecentActivities,
} from "@/api/dashboard";
import {
  DashboardOverview,
  RealTimeStats,
  Alert,
  RegistrationTrends,
  RecentActivity,
} from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trendsData, setTrendsData] = useState<RegistrationTrends | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getDashboardOverview();

        if (response.ok && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch real-time stats with auto-refresh every 10 seconds
  useEffect(() => {
    async function fetchRealTimeStats() {
      try {
        const response = await getRealTimeStats();

        if (response.ok && response.data) {
          setRealTimeData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch real-time stats:", err);
      }
    }

    fetchRealTimeStats();
    const interval = setInterval(fetchRealTimeStats, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch alerts with auto-refresh every 30 seconds
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await getDashboardAlerts();

        if (response.ok && response.data) {
          setAlerts(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch registration trends (one-time on mount)
  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await getRegistrationTrends(12);

        if (response.ok && response.data) {
          setTrendsData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch registration trends:", err);
      }
    }

    fetchTrends();
  }, []);

  // Fetch recent activities with auto-refresh every 30 seconds
  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await getRecentActivities(20);

        if (response.ok && response.data) {
          setActivities(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
      }
    }

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Admin Dashboard"
        description="Overview of all system statistics and metrics"
      />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading dashboard data...</span>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-red-600">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-4">System Overview</h2>
              <DashboardStats data={data} />
            </div>

            {realTimeData && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Real-Time Statistics
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (Updates every 10 seconds)
                  </span>
                </h2>
                <RealTimeStatsDisplay data={realTimeData} />
              </div>
            )}

            {alerts && alerts.length > 0 && (
              <div>
                <AlertsDisplay alerts={alerts} />
              </div>
            )}

            {trendsData && (
              <div>
                <RegistrationTrendsChart data={trendsData} />
              </div>
            )}

            {activities && activities.length > 0 && (
              <div>
                <RecentActivitiesDisplay activities={activities} />
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
