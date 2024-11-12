"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Heart } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export function UserDetailsForm({ onComplete }: { onComplete: () => void }) {
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const allergiesValue = formData.get("allergies")?.toString().trim();
    const allergies = allergiesValue
      ? allergiesValue.split(",").map((a) => a.trim())
      : ["none"];

    const data = {
      age: Number(formData.get("age")),
      lastPeriodDate: date,
      cycleRegularity: formData.get("regularity"),
      allergies,
    };

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-pink-100">
        <CardHeader className="space-y-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg px-6 py-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold text-center text-purple-900">
            Welcome to Your Journey
          </h2>
          <p className="text-purple-600 text-center text-lg">
            Let&apos;s personalize your experience
          </p>
        </CardHeader>
        <CardContent className="px-6 py-8 bg-white rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-purple-900 font-medium">
                Your Age
              </Label>
              <Input
                type="number"
                id="age"
                name="age"
                required
                className="border-pink-200 focus:border-pink-300 focus:ring-pink-200"
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-900 font-medium">
                Last Period Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-pink-500" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-md border-pink-200"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-purple-900 font-medium">
                Cycle Regularity
              </Label>
              <RadioGroup
                defaultValue="regular"
                name="regularity"
                className="bg-pink-50/50 p-4 rounded-lg border border-pink-100"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem
                    value="regular"
                    id="regular"
                    className="text-pink-600 border-pink-300"
                  />
                  <Label htmlFor="regular" className="text-purple-800">
                    Regular (21-35 days)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="irregular"
                    id="irregular"
                    className="text-pink-600 border-pink-300"
                  />
                  <Label htmlFor="irregular" className="text-purple-800">
                    Irregular
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="allergies"
                className="text-purple-900 font-medium"
              >
                Allergies
              </Label>
              <Input
                id="allergies"
                name="allergies"
                className="border-pink-200 focus:border-pink-300 focus:ring-pink-200"
                placeholder="Leave blank if none, or enter allergies (e.g., dairy, nuts)"
              />
              <p className="text-sm text-purple-600 italic">
                Separate multiple allergies with commas
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Profile ✨"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
