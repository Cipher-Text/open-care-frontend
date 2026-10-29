"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { getUserSession } from "@/lib/auth-client";
import { getLatestHealthVitals } from "@/api/health-vitals";
import { HealthVitals } from "@/types/health-vitals";
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Wind,
  TrendingUp,
  TrendingDown,
  Weight,
  Ruler,
  Apple,
  Moon,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function HealthPage() {
  const [vitals, setVitals] = useState<HealthVitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthVitals = async () => {
      try {
        const session = getUserSession();
        if (!session?.access_token) {
          throw new Error("No access token found");
        }

        const vitalsData = await getLatestHealthVitals(session.access_token);
        setVitals(vitalsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load health vitals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealthVitals();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      NORMAL_BP: "bg-success/15 text-success hover:bg-success/15",
      ELEVATED_BP: "bg-warning/15 text-warning hover:bg-warning/15",
      HIGH_BP: "bg-destructive/15 text-destructive hover:bg-destructive/15",
    };

    return (
      statusColors[status] || "bg-muted text-foreground hover:bg-muted"
    );
  };

  const getBMICategory = (bmi: number | null) => {
    if (!bmi) return { label: "N/A", color: "bg-muted text-foreground" };
    if (bmi < 18.5)
      return { label: "Underweight", color: "bg-primary/15 text-primary" };
    if (bmi < 25)
      return { label: "Normal", color: "bg-success/15 text-success" };
    if (bmi < 30)
      return { label: "Overweight", color: "bg-warning/15 text-warning" };
    return { label: "Obese", color: "bg-destructive/15 text-destructive" };
  };

  const getOxygenStatus = (spo2: number | null) => {
    if (!spo2) return { label: "N/A", color: "bg-muted text-foreground" };
    if (spo2 >= 95)
      return { label: "Normal", color: "bg-success/15 text-success" };
    if (spo2 >= 90)
      return { label: "Low", color: "bg-warning/15 text-warning" };
    return { label: "Critical", color: "bg-destructive/15 text-destructive" };
  };

  const getGlucoseStatus = (glucose: number | null) => {
    if (!glucose) return { label: "N/A", color: "bg-muted text-foreground" };
    if (glucose < 70)
      return { label: "Low", color: "bg-warning/15 text-warning" };
    if (glucose <= 100)
      return { label: "Normal", color: "bg-success/15 text-success" };
    if (glucose <= 125)
      return { label: "Prediabetic", color: "bg-warning/15 text-warning" };
    return { label: "High", color: "bg-destructive/15 text-destructive" };
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Health Dashboard"
          description="Monitor your vital signs and health metrics"
        />
        <div className="flex items-center justify-center min-h-96 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading your health data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vitals) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Health Dashboard"
          description="Monitor your vital signs and health metrics"
        />
        <div className="flex items-center justify-center min-h-96 p-8">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Unable to Load Health Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  {error || "No health vitals found"}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  New health vitals can be saved only after you agree to health data consent in your{" "}
                  <Link href="/account/profile" className="underline">
                    profile
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const bmiCategory = getBMICategory(vitals.bmi);
  const oxygenStatus = getOxygenStatus(vitals.oxygenSaturation);
  const glucoseStatus = getGlucoseStatus(vitals.bloodGlucoseMgDl);

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Health Dashboard"
        description="Monitor your vital signs and health metrics"
      />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Your Health Overview</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last recorded: {formatDate(vitals.recordedAt)}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>{vitals.daysSinceLastRecording} days ago</span>
            </div>
          </div>

          {vitals.followUpRequired && (
            <Badge
              variant="outline"
              className="bg-warning/10 text-warning border-warning/30"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Follow-up Required
            </Badge>
          )}
        </div>

        {/* Critical Alerts */}
        {(vitals.isLowOxygen ||
          vitals.isFever ||
          vitals.isObesity ||
          vitals.healthAlerts) && (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vitals.isLowOxygen && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <CheckCircle2 className="h-4 w-4" />
                    Low oxygen saturation detected
                  </div>
                )}
                {vitals.isFever && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <CheckCircle2 className="h-4 w-4" />
                    Elevated body temperature
                  </div>
                )}
                {vitals.isObesity && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <CheckCircle2 className="h-4 w-4" />
                    BMI indicates obesity
                  </div>
                )}
                {vitals.healthAlerts && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <CheckCircle2 className="h-4 w-4" />
                    {vitals.healthAlerts}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vital Signs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Blood Pressure */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Blood Pressure
              </CardTitle>
              <Heart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vitals.bloodPressureSystolic || "N/A"}/
                {vitals.bloodPressureDiastolic || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
              <Badge
                className={`mt-2 ${getStatusBadge(vitals.bloodPressureStatus)}`}
              >
                {vitals.bloodPressureStatus.replace(/_/g, " ")}
              </Badge>
              {vitals.meanArterialPressure && (
                <p className="text-xs text-muted-foreground mt-2">
                  MAP: {vitals.meanArterialPressure.toFixed(1)} mmHg
                </p>
              )}
            </CardContent>
          </Card>

          {/* Heart Rate */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Activity className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vitals.heartRate || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">beats per minute</p>
              {vitals.isTachycardia && (
                <Badge className="mt-2 bg-destructive/15 text-destructive hover:bg-destructive/15">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Tachycardia
                </Badge>
              )}
              {vitals.isBradycardia && (
                <Badge className="mt-2 bg-primary/15 text-primary hover:bg-primary/15">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Bradycardia
                </Badge>
              )}
              {vitals.pulsePressure && (
                <p className="text-xs text-muted-foreground mt-2">
                  Pulse Pressure: {vitals.pulsePressure.toFixed(1)} mmHg
                </p>
              )}
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vitals.temperatureCelsius || "N/A"}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {vitals.temperatureCelsius
                  ? `${((vitals.temperatureCelsius * 9) / 5 + 32).toFixed(1)}°F`
                  : "N/A"}
              </p>
              {vitals.isFever ? (
                <Badge className="mt-2 bg-destructive/15 text-destructive hover:bg-destructive/15">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Fever
                </Badge>
              ) : vitals.isHypothermia ? (
                <Badge className="mt-2 bg-primary/15 text-primary hover:bg-primary/15">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Hypothermia
                </Badge>
              ) : (
                <Badge className="mt-2 bg-success/15 text-success hover:bg-success/15">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Normal
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Oxygen Saturation */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Oxygen Saturation
              </CardTitle>
              <Wind className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vitals.oxygenSaturation || "N/A"}%
              </div>
              <p className="text-xs text-muted-foreground">SpO2 level</p>
              <Badge className={`mt-2 ${oxygenStatus.color}`}>
                {oxygenStatus.label}
              </Badge>
              {vitals.respiratoryRate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Respiratory Rate: {vitals.respiratoryRate} /min
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Body Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* BMI */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-chart-4" />
                Body Mass Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">
                    {vitals.bmi || "N/A"}
                  </div>
                  <Badge className={`mt-2 ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">
                      {vitals.heightCm || "N/A"} cm
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">
                      {vitals.weightKg || "N/A"} kg
                    </span>
                  </div>
                </div>
                {vitals.bmi && (
                  <Progress value={(vitals.bmi / 40) * 100} className="h-2" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blood Glucose */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-destructive" />
                Blood Glucose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">
                    {vitals.bloodGlucoseMgDl || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">mg/dL</p>
                  <Badge className={`mt-2 ${glucoseStatus.color}`}>
                    {glucoseStatus.label}
                  </Badge>
                </div>
                {vitals.bloodGlucoseMmolL && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">mmol/L:</span>
                    <span className="font-medium">
                      {vitals.bloodGlucoseMmolL}
                    </span>
                  </div>
                )}
                {vitals.isHyperglycemia && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    High blood sugar detected
                  </p>
                )}
                {vitals.isHypoglycemia && (
                  <p className="text-xs text-warning flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Low blood sugar detected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Body Composition */}
          {(vitals.bodyFatPercentage ||
            vitals.muscleMassKg ||
            vitals.waistCircumferenceCm) && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Body Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vitals.bodyFatPercentage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Body Fat:</span>
                      <span className="font-medium">
                        {vitals.bodyFatPercentage}%
                      </span>
                    </div>
                  )}
                  {vitals.muscleMassKg && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Muscle Mass:
                      </span>
                      <span className="font-medium">
                        {vitals.muscleMassKg} kg
                      </span>
                    </div>
                  )}
                  {vitals.waistCircumferenceCm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Waist Circumference:
                      </span>
                      <span className="font-medium">
                        {vitals.waistCircumferenceCm} cm
                      </span>
                    </div>
                  )}
                  {vitals.visceralFatLevel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Visceral Fat:
                      </span>
                      <span className="font-medium">
                        Level {vitals.visceralFatLevel}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Lifestyle & Wellness */}
        {(vitals.sleepHoursLastNight ||
          vitals.activeMinutes24h ||
          vitals.stressLevel1To10 ||
          vitals.moodScore1To10) && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {vitals.sleepHoursLastNight && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sleep</CardTitle>
                  <Moon className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vitals.sleepHoursLastNight}h
                  </div>
                  <p className="text-xs text-muted-foreground">last night</p>
                  {vitals.sleepQuality1To5 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Quality:</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < vitals.sleepQuality1To5!
                                ? "bg-chart-1"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {vitals.activeMinutes24h && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Activity
                  </CardTitle>
                  <Zap className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vitals.activeMinutes24h}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    minutes active
                  </p>
                  {vitals.steps24h && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {vitals.steps24h.toLocaleString()} steps
                    </p>
                  )}
                  {vitals.caloriesBurned24h && (
                    <p className="text-xs text-muted-foreground">
                      {vitals.caloriesBurned24h} cal burned
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {vitals.stressLevel1To10 && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stress Level
                  </CardTitle>
                  <Brain className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vitals.stressLevel1To10}/10
                  </div>
                  <Progress
                    value={vitals.stressLevel1To10 * 10}
                    className="h-2 mt-2"
                  />
                  {vitals.anxietyLevel1To10 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Anxiety: {vitals.anxietyLevel1To10}/10
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {vitals.moodScore1To10 && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mood</CardTitle>
                  <Apple className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vitals.moodScore1To10}/10
                  </div>
                  <Progress
                    value={vitals.moodScore1To10 * 10}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Additional Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Measurement Details */}
          <Card>
            <CardHeader>
              <CardTitle>Measurement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vitals.measurementLocation && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium capitalize">
                    {vitals.measurementLocation}
                  </span>
                </div>
              )}
              {vitals.measurementDevice && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Device:</span>
                  <span className="font-medium">
                    {vitals.measurementDevice}
                  </span>
                </div>
              )}
              {vitals.measurementMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium">
                    {vitals.measurementMethod}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created By:</span>
                <span className="font-medium">{vitals.createdBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {formatDate(vitals.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Symptoms */}
          {(vitals.notes || vitals.symptoms) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes & Observations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vitals.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">
                      {vitals.notes}
                    </p>
                  </div>
                )}
                {vitals.symptoms && (
                  <div>
                    <p className="text-sm font-medium mb-1">Symptoms:</p>
                    <p className="text-sm text-muted-foreground">
                      {vitals.symptoms}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
