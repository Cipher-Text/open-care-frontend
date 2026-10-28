"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { getDashboardOverview } from "@/api/dashboard";
import { DashboardOverview } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/** The super admin overview: real counts from the database, nothing simulated. */
export function SuperAdminDashboard() {
  const [data, setData] = useState<DashboardOverview | null>(null);
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

  return (
    <section aria-label="System overview" className="space-y-4">
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
            <div className="text-center text-destructive">
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
          <div className="text-sm text-muted-foreground">
            Counts from the database, last updated: {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </>
      )}
    </section>
  );
}
