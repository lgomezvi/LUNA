// src/components/symptom-history.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, Heart, Circle } from "lucide-react";
import type { Symptom } from "./symptom-tracker";

const categoryIcons: Record<string, any> = {
  physical: Activity,
  emotional: Heart,
  other: Circle,
};

interface SymptomWithId extends Symptom {
  _id: string; // MongoDB adds _id instead of id
}

export function SymptomHistory() {
  const [symptoms, setSymptoms] = useState<SymptomWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch("/api/symptoms");
        if (response.ok) {
          const data = await response.json();
          setSymptoms(data.symptoms);
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  if (loading) {
    return <div>Loading symptoms...</div>;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-md">
      <CardHeader>
        <h2 className="text-xl font-semibold text-purple-900">
          Recent Symptoms
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {symptoms.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No symptoms logged yet
            </p>
          ) : (
            symptoms.map((symptom) => {
              const Icon = categoryIcons[symptom.category];
              return (
                <div
                  key={symptom._id} // Use MongoDB's _id field
                  className="flex items-center space-x-4 p-3 rounded-lg bg-purple-50/50"
                >
                  <Icon className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <h3 className="font-medium text-purple-900">
                      {symptom.type}
                    </h3>
                    <p className="text-sm text-purple-600">
                      {format(new Date(symptom.date), "PPP")}
                    </p>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                    Severity: {symptom.severity}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
