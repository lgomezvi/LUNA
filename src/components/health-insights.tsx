// src/components/health-insights.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Apple,
  ActivitySquare,
  AlertCircle,
  Loader2,
  RefreshCw,
  Moon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateCycleStatus } from "@/lib/cycle-helpers";
import type { CycleStatus } from "@/types";

interface InsightSection {
  title: string;
  icon: any;
  color: string;
}

const SECTIONS: Record<string, InsightSection> = {
  "symptom management": {
    title: "Symptom Management",
    icon: ActivitySquare,
    color: "text-rose-500",
  },
  "nutrition plan": {
    title: "Nutrition Plan",
    icon: Apple,
    color: "text-green-500",
  },
  "physical wellness": {
    title: "Physical Wellness",
    icon: Sparkles,
    color: "text-blue-500",
  },
  "mental wellness": {
    title: "Mental Wellness",
    icon: Brain,
    color: "text-purple-500",
  },
  "cycle insights": {
    title: "Cycle Insights",
    icon: AlertCircle,
    color: "text-amber-500",
  },
};

interface HealthInsightsProps {
  userData: {
    lastPeriodDate?: string;
    cycleRegularity?: string;
    cycleLength?: number;
    allergies?: string[];
  };
}

export function HealthInsights({ userData }: HealthInsightsProps) {
  const [insights, setInsights] = useState<Record<string, string[]> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const cycleStatus: CycleStatus = calculateCycleStatus(userData);


  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get latest user data
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      // Calculate cycle status
      const cycleStatus = calculateCycleStatus(userData);

      const response = await fetch("/api/health-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cyclePhase: cycleStatus.currentPhase.name,
          dayOfCycle: cycleStatus.dayOfCycle,
          nextPhase: cycleStatus.nextPhase?.name,
          daysUntilNextPhase: cycleStatus.daysUntilNextPhase,
          currentPhaseDescription: cycleStatus.currentPhase.description,
          phaseStartDate: cycleStatus.phaseStartDate,
          phaseEndDate: cycleStatus.phaseEndDate,
          symptoms: [],
          allergies: userData.allergies || [],
          preferences: {
            diet: userData.dietaryPreference,
            culture: userData.culturalBackground,
            exercise: userData.exercisePreferences,
            language: userData.languagePreference
          },
          healthContext: {
            hasConditions: userData.hasHealthConditions,
            conditions: userData.healthConditions,
            goals: userData.healthGoals
          },
          nextPeriod: cycleStatus.nextPeriod,
          cycleRegularity: userData.cycleRegularity,
          cycleLength: userData.cycleLength,
          periodLength: userData.periodLength
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Unable to generate health insights. Please try again later.");
      console.error("Error fetching insights:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Cycle Status Section */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Phase */}
            <div className="flex items-start space-x-4">
              <Moon className="h-8 w-8 text-purple-600 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-purple-900">
                  Current Phase
                </h2>
                <p
                  className={`${cycleStatus.currentPhase.color} font-medium text-lg`}
                >
                  {cycleStatus.currentPhase.name} Phase
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  Day {cycleStatus.dayOfCycle} of cycle
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-purple-800">
                  {cycleStatus.currentPhase.description}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-purple-900 mb-1">
                      Recommended Foods
                    </h3>
                    <ul className="text-sm text-purple-700">
                      {cycleStatus.currentPhase.nutrition.map((item, i) => (
                        <li key={i} className="flex items-center space-x-1">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-purple-900 mb-1">
                      Suggested Activities
                    </h3>
                    <ul className="text-sm text-purple-700">
                      {cycleStatus.currentPhase.exercise.map((item, i) => (
                        <li key={i} className="flex items-center space-x-1">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {cycleStatus.isIrregular && (
                  <div className="mt-3 text-sm text-purple-600 italic">
                    Note: These predictions are estimates. Regular tracking will
                    improve accuracy.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-purple-900">
              AI Health Insights
            </h2>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={fetchInsights}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {loading ? "Analyzing..." : "Get AI Insights"}
          </Button>
        </CardHeader>
        <CardContent>
          {!userData.lastPeriodDate ? (
            <div className="text-center text-gray-500 p-4">
              Please update your last period date to get personalized insights.
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : !insights ? (
            <div className="text-center text-gray-500 p-4">
              Click the button above to get AI-powered insights based on your
              cycle and symptoms.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(insights).map(([key, content]) => {
                const section = SECTIONS[key];
                if (!section) return null;
                const Icon = section.icon;

                return (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${section.color}`} />
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-4">
                        {" "}
                        {/* Increased spacing between sections */}
                        {Array.isArray(content) ? (
                          content.map((item, index) => {
                            // Check if the line ends with a colon - it's a title
                            if (item.endsWith(":")) {
                              return (
                                <div key={index} className="mt-4 first:mt-0">
                                  {" "}
                                  {/* Spacing before new sections */}
                                  <p className="font-semibold text-purple-900">
                                    {item}
                                  </p>
                                </div>
                              );
                            }
                            return (
                              <p
                                key={index}
                                className="text-gray-700 leading-relaxed"
                              >
                                {item}
                              </p>
                            );
                          })
                        ) : (
                          <p className="text-gray-700 leading-relaxed">
                            {content}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
