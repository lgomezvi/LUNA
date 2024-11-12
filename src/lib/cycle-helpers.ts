// src/lib/cycle-helpers.ts

import { CyclePhase, CycleStatus } from "@/types";

const CYCLE_PHASES: CyclePhase[] = [
    {
        name: "Menstrual",
        day: 1, // Days 1-5
        description: "Your period has started. Focus on rest and self-care.",
        nutrition: [
            "Iron-rich foods",
            "Dark chocolate",
            "Anti-inflammatory foods"
        ],
        exercise: [
            "Light walking",
            "Gentle yoga",
            "Stretching"
        ],
        color: "text-rose-600"
    },
    {
        name: "Follicular",
        day: 6, // Days 6-11
        description: "Energy levels begin to rise. Great time for new starts.",
        nutrition: [
            "Fermented foods",
            "Lean proteins",
            "Fresh fruits"
        ],
        exercise: [
            "High-intensity workouts",
            "Strength training",
            "Cardio"
        ],
        color: "text-purple-600"
    },
    {
        name: "Ovulatory",
        day: 12, // Days 12-16
        description: "Peak energy and fertility. Embrace your natural confidence.",
        nutrition: [
            "Light, fresh foods",
            "Raw vegetables",
            "Antioxidant-rich foods"
        ],
        exercise: [
            "High-intensity workouts",
            "Group classes",
            "Dancing"
        ],
        color: "text-pink-600"
    },
    {
        name: "Luteal",
        day: 17, // Days 17-28
        description: "Wind down phase. Listen to your body's needs.",
        nutrition: [
            "Complex carbs",
            "Magnesium-rich foods",
            "Calming teas"
        ],
        exercise: [
            "Moderate cardio",
            "Pilates",
            "Swimming"
        ],
        color: "text-purple-500"
    }
];

export function calculateCycleStatus(userData: {
    lastPeriodDate?: string;
    cycleRegularity?: string;
    cycleLength?: number;
}): CycleStatus {
    const today = new Date();
    const lastPeriod = userData.lastPeriodDate
        ? new Date(userData.lastPeriodDate)
        : null;
    const isIrregular = userData.cycleRegularity === "irregular";
    const cycleLength = userData.cycleLength || 28;

    // If no last period date or irregular with no recent tracking
    if (!lastPeriod) {
        return {
            currentPhase: {
                name: "Tracking",
                day: 0,
                description: "Start tracking to get personalized insights",
                nutrition: ["Balanced diet", "Regular meals"],
                exercise: ["Regular movement", "Listen to your body"],
                color: "text-purple-600"
            },
            dayOfCycle: 0,
            nextPeriod: 0,
            isIrregular: true
        };
    }

    // Calculate days since last period
    const daysSinceLastPeriod = Math.floor(
        (today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate current day in cycle
    const dayOfCycle = (daysSinceLastPeriod % cycleLength) + 1;

    // Calculate days until next period
    const nextPeriod = cycleLength - ((daysSinceLastPeriod % cycleLength));

    // Determine current phase
    let currentPhase: CyclePhase;
    if (dayOfCycle <= 5) {
        currentPhase = CYCLE_PHASES[0]; // Menstrual
    } else if (dayOfCycle <= 11) {
        currentPhase = CYCLE_PHASES[1]; // Follicular
    } else if (dayOfCycle <= 16) {
        currentPhase = CYCLE_PHASES[2]; // Ovulatory
    } else {
        currentPhase = CYCLE_PHASES[3]; // Luteal
    }

    // If irregular, add uncertainty to the description
    if (isIrregular) {
        currentPhase = {
            ...currentPhase,
            description: `Possible ${currentPhase.name.toLowerCase()} phase. Tracking helps improve predictions.`,
        };
    }

    return {
        currentPhase,
        dayOfCycle,
        nextPeriod,
        isIrregular
    };
}