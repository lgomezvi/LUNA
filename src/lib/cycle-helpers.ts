import { CyclePhase, CycleStatus } from "@/types";

const CYCLE_PHASES: CyclePhase[] = [
    {
        name: "Menstrual",
        day: 1,
        duration: 5,
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
        day: 6,
        duration: 6,
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
        day: 12,
        duration: 5,
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
        day: 17,
        duration: 12,
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

    if (!lastPeriod) {
        return {
            currentPhase: {
                name: "Tracking",
                day: 0,
                duration: 0,
                description: "Start tracking to get personalized insights",
                nutrition: ["Balanced diet", "Regular meals"],
                exercise: ["Regular movement", "Listen to your body"],
                color: "text-purple-600"
            },
            dayOfCycle: 0,
            nextPeriod: 0,
            isIrregular: true,
            phaseStartDate: null,
            phaseEndDate: null,
            daysUntilNextPhase: 0,
            nextPhase: null
        };
    }

    const daysSinceLastPeriod = Math.floor(
        (today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dayOfCycle = (daysSinceLastPeriod % cycleLength) + 1;
    const nextPeriod = cycleLength - ((daysSinceLastPeriod % cycleLength));

    let currentPhase: CyclePhase;
    let nextPhase: CyclePhase | null = null;

    if (dayOfCycle <= 5) {
        currentPhase = CYCLE_PHASES[0];
        nextPhase = CYCLE_PHASES[1];
    } else if (dayOfCycle <= 11) {
        currentPhase = CYCLE_PHASES[1];
        nextPhase = CYCLE_PHASES[2];
    } else if (dayOfCycle <= 16) {
        currentPhase = CYCLE_PHASES[2];
        nextPhase = CYCLE_PHASES[3];
    } else {
        currentPhase = CYCLE_PHASES[3];
        nextPhase = CYCLE_PHASES[0];
    }

    const phaseStartDate = new Date(today);
    phaseStartDate.setDate(today.getDate() - (dayOfCycle - currentPhase.day));

    const phaseEndDate = new Date(phaseStartDate);
    phaseEndDate.setDate(phaseStartDate.getDate() + currentPhase.duration - 1);

    const daysUntilNextPhase = Math.max(0,
        Math.ceil((phaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );

    if (isIrregular) {
        currentPhase = {
            ...currentPhase,
            description: `Possible ${currentPhase.name.toLowerCase()} phase. Tracking helps improve predictions.`
        };
    }

    return {
        currentPhase,
        dayOfCycle,
        nextPeriod,
        isIrregular,
        phaseStartDate,
        phaseEndDate,
        daysUntilNextPhase,
        nextPhase
    };
}