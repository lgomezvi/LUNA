import { Card, CardContent } from "@/components/ui/card";
import { Moon } from "lucide-react";

import { calculateCycleStatus } from "@/lib/cycle-helpers";

export function CycleStatusCard({
  userData,
}: {
  userData: {
    lastPeriodDate?: string;
    cycleRegularity?: string;
    cycleLength?: number;
  };
}) {
  const cycleStatus = calculateCycleStatus(userData);

  return (
    <Card className="col-span-full bg-gradient-to-r from-purple-100 to-pink-100">
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
  );
}
