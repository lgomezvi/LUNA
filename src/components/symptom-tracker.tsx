// src/components/symptom-tracker.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  Thermometer,
  Heart,
  Battery,
  Circle,
  HeartPulse,
  Brain,
  Droplet,
  Frown,
  Smile,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Symptom {
  id?: string;
  date: Date;
  category: "physical" | "emotional" | "other";
  type: string;
  severity: number;
  notes?: string;
}

interface SymptomOption {
  label: string;
  category: "physical" | "emotional" | "other";
  icon: any;
  color: string;
}

const COMMON_SYMPTOMS: SymptomOption[] = [
  {
    label: "Cramps",
    category: "physical",
    icon: Activity,
    color: "text-rose-500",
  },
  {
    label: "Headache",
    category: "physical",
    icon: Brain,
    color: "text-purple-500",
  },
  {
    label: "Mood Changes",
    category: "emotional",
    icon: Heart,
    color: "text-pink-500",
  },
  {
    label: "Fatigue",
    category: "physical",
    icon: Battery,
    color: "text-orange-500",
  },
  {
    label: "Bloating",
    category: "physical",
    icon: Circle,
    color: "text-blue-500",
  },
  {
    label: "Anxiety",
    category: "emotional",
    icon: HeartPulse,
    color: "text-red-500",
  },
  {
    label: "Nausea",
    category: "physical",
    icon: Thermometer,
    color: "text-green-500",
  },
  {
    label: "Flow",
    category: "physical",
    icon: Droplet,
    color: "text-blue-600",
  },
  {
    label: "Sad",
    category: "emotional",
    icon: Frown,
    color: "text-indigo-500",
  },
  {
    label: "Happy",
    category: "emotional",
    icon: Smile,
    color: "text-yellow-500",
  },
  {
    label: "Dizziness",
    category: "physical",
    icon: Plus, // replace with an appropriate icon if available
    color: "text-teal-500",
  },
  {
    label: "Irritability",
    category: "emotional",
    icon: Brain, // you may choose a different icon if preferred
    color: "text-red-400",
  },
  
];

export function SymptomTracker() {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomOption | null>(
    null
  );
  const [severity, setSeverity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleSymptomClick = async (symptom: SymptomOption) => {
    if (selectedSymptom?.label === symptom.label) {
      setLoading(true);
      try {
        const response = await fetch("/api/symptoms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: new Date(),
            category: symptom.category,
            type: symptom.label,
            severity: severity,
          }),
        });

        if (response.ok) {
          // Reset selection after successful logging
          console.log(`Symptom logged successfully ${symptom.label} with severity ${severity}`);
          setSelectedSymptom(null);
          setSeverity(1);
        }
      } catch (error) {
        console.error("Error logging symptom:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedSymptom(symptom);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-purple-900">
            How are you feeling?
          </h2>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {COMMON_SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptom?.label === symptom.label;
            const Icon = symptom.icon;

            return (
              <Button
                key={symptom.label}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center p-3 h-auto gap-2 transition-all",
                  isSelected && "bg-purple-50 ring-2 ring-purple-200"
                )}
                onClick={() => handleSymptomClick(symptom)}
                disabled={loading}
              >
                <Icon className={cn("h-6 w-6", symptom.color)} />
                <span className="text-xs text-center font-medium">
                  {symptom.label}
                </span>
                {isSelected && (
                  <div className="w-full mt-2">
                    <Slider
                      value={[severity]}
                      min={1}
                      max={3}
                      step={1}
                      onValueChange={(value: number[]) => setSeverity(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Mild</span>
                      <span>Severe</span>
                    </div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
