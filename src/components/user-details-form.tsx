// src/app/components/UserDetailsForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar as CalendarIcon,
  Heart,
  Globe,
  Utensils,
  Activity
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

const dietaryPreferences = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "No restrictions",
  "Other"
];

const culturalBackgrounds = [
  "South Asian",
  "East Asian",
  "Middle Eastern",
  "African",
  "European",
  "Latin American",
  "Caribbean",
  "Pacific Islander",
  "Indigenous/Native",
  "Other"
];

const exercisePreferences = [
  "Yoga/Stretching",
  "Walking/Running",
  "Swimming",
  "Dance",
  "Strength Training",
  "Sports",
  "Low Impact",
  "Other"
];

export function UserDetailsForm({ onComplete }: { onComplete: () => void }) {
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    if (!date) {
      alert("Please select your last period date");
      setIsLoading(false);
      return;
    }

    const allergiesValue = formData.get("allergies")?.toString().trim();
    const allergies = allergiesValue
      ? allergiesValue.split(",").map((a) => a.trim())
      : ["none"];

    const data = {
      age: Number(formData.get("age")),
      lastPeriodDate: date.toISOString(), // Convert date to ISO string
      cycleRegularity: formData.get("regularity"),
      allergies,
      culturalBackground: formData.get("culturalBackground"),
      dietaryPreference: formData.get("dietaryPreference"),
      exercisePreferences: selectedExercises.map(ex => ex.toLowerCase()), // Ensure lowercase
      cycleLength: Number(formData.get("cycleLength")) || 28,
      periodLength: Number(formData.get("periodLength")) || 5,
      healthGoals: formData.get("healthGoals")?.toString().trim(),
      languagePreference: formData.get("language"),
      hasHealthConditions: formData.get("hasHealthConditions") === "true",
      healthConditions: formData.get("healthConditions")?.toString().trim(),
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
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Failed to save your details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-pink-100">
        <CardHeader className="space-y-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg px-6 py-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold text-center text-purple-900">
            Personalize Your Health Journey
          </h2>
          <p className="text-purple-600 text-center text-lg">
            Help us provide culturally-aware, personalized health insights
          </p>
        </CardHeader>

        <CardContent className="px-6 py-8 bg-white rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Language Preference
                  </Label>
                  <Select name="language" defaultValue="en">
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cultural Context Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Cultural Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-purple-900 font-medium">
                    Cultural Background
                  </Label>
                  <Select name="culturalBackground" required>
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select background" />
                    </SelectTrigger>
                    <SelectContent>
                      {culturalBackgrounds.map((background) => (
                        <SelectItem key={background} value={background.toLowerCase()}>
                          {background}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-900 font-medium">
                    Dietary Preference
                  </Label>
                  <Select name="dietaryPreference" required>
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietaryPreferences.map((diet) => (
                        <SelectItem key={diet} value={diet.toLowerCase()}>
                          {diet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Health Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Health Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-900 font-medium">
                    Last Period Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-pink-200 hover:bg-pink-50"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength" className="text-purple-900 font-medium">
                      Typical Cycle Length (days)
                    </Label>
                    <Input
                      type="number"
                      id="cycleLength"
                      name="cycleLength"
                      defaultValue={28}
                      className="border-pink-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodLength" className="text-purple-900 font-medium">
                      Typical Period Length (days)
                    </Label>
                    <Input
                      type="number"
                      id="periodLength"
                      name="periodLength"
                      defaultValue={5}
                      className="border-pink-200"
                    />
                  </div>
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
              </div>
            </div>

            {/* Lifestyle & Preferences Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Lifestyle & Goals
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-900 font-medium block mb-4">
                    Exercise Preferences (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {exercisePreferences.map((exercise) => (
                      <div key={exercise} className="flex items-center space-x-2">
                        <Checkbox
                          id={exercise}
                          checked={selectedExercises.includes(exercise)}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setSelectedExercises([...selectedExercises, exercise]);
                            } else {
                              setSelectedExercises(
                                selectedExercises.filter((e) => e !== exercise)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={exercise} className="text-sm">
                          {exercise}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthGoals" className="text-purple-900 font-medium">
                    Health Goals
                  </Label>
                  <Input
                    id="healthGoals"
                    name="healthGoals"
                    className="border-pink-200"
                    placeholder="What are your main health and wellness goals?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-purple-900 font-medium">
                    Allergies
                  </Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    className="border-pink-200"
                    placeholder="Leave blank if none, or enter allergies (e.g., dairy, nuts)"
                  />
                  <p className="text-sm text-purple-600 italic">
                    Separate multiple allergies with commas
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 
                hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all 
                duration-200 ease-in-out transform hover:scale-[1.02]"
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