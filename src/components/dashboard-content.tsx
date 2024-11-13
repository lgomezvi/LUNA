// src/components/dashboard-content.tsx
"use client";

import { UserDetailsForm } from "@/components/user-details-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Apple, Dumbbell } from "lucide-react";
import { LogoutButton } from "@/components/auth-buttons";
import { UserData } from "@/types";
import { Session } from "next-auth";
import { CycleStatusCard } from "@/components/cycle-status";
import { SymptomTracker } from "@/components/symptom-tracker";
import { SymptomHistory } from "@/components/symptom-history";
import { HealthInsights } from "@/components/health-insights";

interface DashboardContentProps {
  user: Session["user"];
  userData: UserData | null;
}

export function DashboardContent({ user, userData }: DashboardContentProps) {
  if (!userData?.detailsCompleted) {
    return <UserDetailsForm onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-600">
              Track, understand, and optimize your cycle
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HealthInsights
            userData={
              userData as {
                lastPeriodDate?: string;
                cycleRegularity?: string;
                cycleLength?: number;
                allergies?: string[];
              }
            }
          />

          {/* Add Symptom Tracker - full width */}
          <div className="col-span-full">
            <SymptomTracker />
          </div>

          {/* Today's Recommendations */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Today Nutrition</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Apple className="h-5 w-5 text-green-500" />
                <p>Focus on iron-rich foods</p>
              </div>
              {userData.allergies &&
                userData.allergies.length > 0 &&
                userData.allergies[0] !== "none" && (
                  <p className="text-sm text-red-500 mt-2">
                    Avoid: {userData.allergies.join(", ")}
                  </p>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Workout Plan</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Dumbbell className="h-5 w-5 text-rose-500" />
                <p>Light cardio recommended</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Next Period</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <p>
                  {userData.lastPeriodDate
                    ? `Expected in ${calculateNextPeriod(
                        userData.lastPeriodDate,
                        userData.cycleLength
                      )} days`
                    : "Update your last period date"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Symptom History - full width */}
        <div className="col-span-full">
          <SymptomHistory />
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate next period
function calculateNextPeriod(
  lastPeriod: Date | string,
  cycleLength: number = 28
): number {
  const today = new Date();
  const lastPeriodDate = new Date(lastPeriod);
  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return cycleLength - (daysSinceLastPeriod % cycleLength);
}
