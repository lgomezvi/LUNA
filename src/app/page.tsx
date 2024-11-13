// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth-buttons";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import {
  Calendar,
  Moon,
  Brain,
  Activity,
  Sparkles,
  Heart,
  ShieldCheck,
  BookOpen,
  Globe,
  Gift
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const insights = {
  'symptom_management': [
    'Current symptom recommendations: As you are in the Follicular Phase, you may experience mild physical symptoms such as breast tenderness or bloating. Light exercise, warm baths, and over-the-counter pain relievers can help manage these symptoms.',
    'Preventive measures: Maintain a healthy diet rich in fruits, vegetables, and whole grains. Stay hydrated by drinking plenty of water throughout the day.',
    'Warning signs to watch for: If you experience severe pain, heavy bleeding, or a change in vaginal discharge, consult a healthcare professional promptly.'
  ],
  'nutrition_plan': [
    'Phase-specific foods to eat: This phase is characterized by estrogen production. Include foods rich in phytoestrogens, such as soybeans, tofu, and lentils. Leafy green vegetables, whole grains, and berries provide antioxidants and fiber.',
    'Foods to avoid: Limit processed foods, sugary drinks, and excessive caffeine, as they can contribute to hormonal imbalances.',
    'Supplement considerations: If you have a deficiency, a healthcare professional may recommend iron supplements or prenatal vitamins.'
  ],
  'physical_wellness': [
    'Recommended exercises: Engage in moderate-intensity exercise for at least 30 minutes most days of the week. Activities like brisk walking, swimming, or yoga help improve circulation and well-being.',
    'Activity modifications: Avoid strenuous exercise that can strain pelvic muscles or cause excessive sweating.',
    'Recovery techniques: Allow yourself enough rest and recovery time between workouts. Gentle stretching and massages can promote relaxation and reduce muscle soreness.'
  ],
  'mental_wellness': [
    'Stress management: Practice relaxation techniques such as deep breathing, meditation, or yoga. Consider connecting with a support group or therapist if stress levels are high.',
    'Mood support: Ensure adequate sleep (7-9 hours per night) and engage in activities that bring you joy. If mood changes are significant, consult a healthcare professional.',
    'Mindfulness practices: Pay attention to your thoughts and sensations without judgment. Engage in activities that foster presence and self-awareness, such as journaling or nature walks.'
  ],
  'cycle_insights': [
    'Pattern analysis: Your cycle is regular at 28 days, with ovulation typically occurring around Day 14. Tracking your symptoms and cycle can help identify any potential irregularities.',
    'Lifestyle adjustments: Maintaining a balanced diet, regular exercise, and adequate sleep can positively impact hormone regulation and overall cycle health.',
    'Next phase preparation: As you approach the Ovulation Phase, your body will start producing luteinizing hormone (LH). Stay hydrated and consider using ovulation predictor kits to increase chances of conception.'
  ]
};

// Add these constants at the top of your file
const SECTIONS = {
  symptom_management: {
    title: "Symptom Management",
    icon: Activity,
    color: "text-rose-500"
  },
  nutrition_plan: {
    title: "Nutrition Plan",
    icon: Utensils,
    color: "text-green-500"
  },
  physical_wellness: {
    title: "Physical Wellness",
    icon: Heart,
    color: "text-purple-500"
  },
  mental_wellness: {
    title: "Mental Wellness",
    icon: Brain,
    color: "text-blue-500"
  },
  cycle_insights: {
    title: "Cycle Insights",
    icon: Calendar,
    color: "text-pink-500"
  }
};

// Add these imports at the top
import { Utensils } from "lucide-react";


// Expanded features highlighting healthcare access and empowerment
const features = [
  {
    icon: <Globe className="h-6 w-6 text-purple-500" />,
    title: "Culturally Inclusive",
    description: "Personalized insights that respect and adapt to your cultural background and preferences"
  },
  {
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    title: "AI-Powered Health",
    description: "Google Gemini powered insights for personalized healthcare recommendations"
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
    title: "Privacy First",
    description: "Your health data is encrypted and protected, putting you in control"
  },
  {
    icon: <Heart className="h-6 w-6 text-rose-500" />,
    title: "Holistic Wellness",
    description: "Comprehensive tracking of physical and mental well-being"
  }
];

const impactStats = [
  { number: "1B+", label: "Women of Reproductive Age Worldwide" },
  { number: "500M+", label: "Potential App Users Globally" },
  { number: "180+*", label: "Countries Reached" },
  { number: "75%", label: "Women Interested in Health Recommendations" },
  { number: "95%*", label: "Improved Symptom Awareness" },
  { number: "85%*", label: "Users Reporting Better Health Decisions" },
];


export default function Home() {
  const [showAI, setShowAI] = useState(false);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Gradient Animation */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 animate-gradient-x">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 py-32 sm:px-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-8">
                <Moon className="h-12 w-12 text-purple-600" />
                <Gift className="h-8 w-8 text-pink-500 animate-bounce" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-900 via-pink-800 to-rose-900 bg-clip-text text-transparent mb-6">
                LUNA: Empowering Women's Health With AI
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Join the future of women's healthcare. LUNA combines cultural awareness,
                cutting-edge AI, and comprehensive health tracking to provide personalized care
                that understands and supports your unique journey.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <AuthStatus />
                <Button
                  variant="outline"
                  className="bg-white/50 hover:bg-white/80 transition-all"
                  onClick={() => window.open("https://devpost.com/software/luna-ai-health", "_blank")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-purple-600">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-gradient-to-b from-white to-purple-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">
              Advancing Women's Healthcare Access
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              LUNA is more than an app - it's a movement towards accessible,
              personalized healthcare for women everywhere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
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

      <section className="py-20 px-6 sm:px-8 md:px-12 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-6">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-purple-900 mb-6">
              Experience Our Google Gemini Powered AI
            </h2>
            <p className="text-gray-600 max-w-2xl mb-8">
              Discover how LUNA's AI provides personalized health insights,
              making healthcare more accessible and understanding.
            </p>
            {!showAI && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 
                  hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowAI(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                See AI in Action
              </Button>
            )}
          </div>

          {showAI && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-10 right-2 bg-white/50 hover:bg-white/80 z-10"
                onClick={() => setShowAI(false)}
              >
                Close Demo
              </Button>
              <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <h3 className="text-xl font-semibold text-purple-900">
                      Your AI Health Assistant
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Personalized insights powered by Google Gemini, tailored to your cycle phase
                  </p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(insights).map(([key, content]) => {
                      const section = SECTIONS[key as keyof typeof SECTIONS];
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
                              {content.map((item, index) => {
                                // Split into title and content if contains ':'
                                const [title, ...rest] = item.split(': ');
                                const hasTitle = rest.length > 0;

                                return hasTitle ? (
                                  <div key={index} className="space-y-2">
                                    <h4 className="font-medium text-purple-900">{title}:</h4>
                                    <p className="text-gray-700 leading-relaxed pl-4">
                                      {rest.join(': ')}
                                    </p>
                                  </div>
                                ) : (
                                  <p key={index} className="text-gray-700 leading-relaxed">
                                    {item}
                                  </p>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="py-20 px-6 sm:px-8 md:px-12 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Healthcare Revolution
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Be part of our mission to make personalized healthcare accessible to women worldwide.
            Together, we're building a healthier, more empowered future.
          </p>
          <div className="flex justify-center gap-4">
            <AuthStatus />
          </div>
        </div>
      </section>
    </main>
  );
}