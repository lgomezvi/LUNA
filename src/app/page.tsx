// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth-buttons";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Moon, Apple, Dumbbell, Brain } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: <Calendar className="h-6 w-6 text-purple-500" />,
    title: "Period Tracking",
    description: "Smart and accurate cycle predictions customized to your body",
  },
  {
    icon: <Apple className="h-6 w-6 text-green-500" />,
    title: "Nutrition Guide",
    description:
      "Personalized food recommendations for each phase of your cycle",
  },
  {
    icon: <Dumbbell className="h-6 w-6 text-rose-500" />,
    title: "Workout Plans",
    description: "Exercise routines optimized for your hormonal changes",
  },
  {
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    title: "AI Support",
    description: "24/7 answers to your questions powered by Google Gemini",
  },
];

const testimonials = [
  {
    quote: "LUNA has completely changed how I understand my body.",
    author: "Sarah, 28",
    role: "Fitness Enthusiast",
  },
  {
    quote: "The AI-powered insights are like having a personal health coach.",
    author: "Maria, 32",
    role: "Working Professional",
  },
];

export default function Home() {
  const [showAI, setShowAI] = useState(false);
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <Moon className="h-16 w-16 text-purple-600 mb-6" />
            <h1 className="text-5xl font-bold text-purple-900 mb-6">
              LUNA: Your Personal Cycle Companion
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Understand your body better with personalized period tracking,
              nutrition advice, and AI-powered insights.
            </p>
            <div className="flex gap-4">
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need in One Place
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {feature.icon}
                    <h3 className="text-xl font-semibold mt-4 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-purple-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6">
                Meet Your AI Health Assistant
              </h2>
              <p className="text-gray-600 mb-8">
                Powered by Google Gemini, get instant answers about your cycle,
                nutrition, workouts, and more. Available 24/7 to support your
                wellness journey.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAI(true)}>
                Try AI Assistant
              </Button>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
              {/* Placeholder for AI chat interface */}
              <div className="bg-gray-100 rounded p-4 mb-4">
                &quot;What foods should I eat the next 7 days?&quot;
              </div>
              {showAI && (
                <>
                  <div className="bg-purple-100 rounded p-4">
                    &quot;During your luteal phase, focus on foods rich in B
                    vitamins and magnesium...&quot;
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50"
              >
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic mb-4">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-purple-900 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of women who have transformed their relationship with
            their bodies using LUNA.
          </p>
          <AuthStatus />
        </div>
      </section>
    </main>
  );
}
