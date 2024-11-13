// src/app/api/health-insights/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { User } from "@/models/user";
import connectDB from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Symptom {
    type: string;
    category: string;
    severity: number;
    date: Date;
}

interface HealthContext {
    // Cycle Status Information
    cyclePhase: string;
    dayOfCycle: number;
    phaseDescription: string;
    recommendedNutrition: string[];
    recommendedExercise: string[];
    isIrregular: boolean;
    currentPhaseColor: string;
    phaseDuration: number;
    phaseStartDate: Date;
    phaseEndDate: Date;
    daysUntilNextPhase: number;
    nextPhase?: string;

    // User Data
    symptoms: Symptom[];
    allergies: string[];
    preferences: {
        diet: string;
        culture: string;
        exercise: string[];
        language: string;
    };
    healthContext: {
        hasConditions: boolean;
        conditions: string;
        goals: string;
    };

    // Cycle Data
    nextPeriod: Date;
    cycleRegularity: string;
    cycleLength: number;
    periodLength: number;
}
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 7);

        const recentSymptoms = user.symptoms
            .filter((s: Symptom) => new Date(s.date) >= recentDate)
            .sort((a: Symptom, b: Symptom) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const symptomAnalysis = analyzeSymptoms(recentSymptoms);
        const data: HealthContext = await request.json();

        console.log("Health insights request data:", data);

        const prompt = `You are a deeply empathetic women's health expert with extensive knowledge of ${data.preferences.culture} cultural wellness traditions. Your role is to be a supportive guide while providing personalized health insights that honor both traditional wisdom and modern understanding.

        PERSONAL PROFILE:
        🎯 Goals: ${data.healthContext.goals}
        🏃‍♀️ Favorite Activities: ${data.preferences.exercise.join(", ")}
        🍽️ Dietary Practice: ${data.preferences.diet}
        🌍 Cultural Heritage: ${data.preferences.culture}
        🗣️ Language: ${data.preferences.language}
        
        CYCLE JOURNEY:
        📅 Current Phase: ${data.cyclePhase} (Day ${data.dayOfCycle} of ${data.cycleLength})
        ⏱️ Cycle Pattern: ${data.cycleRegularity} cycles, ${data.periodLength} days period
        📆 Next Period: ${new Date(data.nextPeriod).toLocaleDateString()}
        
        WELLNESS PROFILE:
        🏥 Health Considerations: ${data.healthContext.hasConditions ? data.healthContext.conditions : 'No reported conditions'}
        ⚠️ Allergies: ${user.allergies?.join(", ") || "None reported"}
        
        YOUR RECENT PATTERNS:
        ${formatSymptomAnalysis(symptomAnalysis)}
        
        Please provide caring, culturally-sensitive guidance in exactly this format:
        
        1. SYMPTOM MANAGEMENT
        Current symptom recommendations for your ${data.cyclePhase} phase:
        Gentle prevention strategies aligned with your traditions:
        Important signs to be mindful of:
        
        2. NUTRITION PLAN
        Nourishing ${data.preferences.diet} foods for your current phase:
        Foods to mindfully avoid during this time:
        Supportive supplements to consider:
        
        3. PHYSICAL WELLNESS
        Harmonious ${data.preferences.exercise.join("/")} practices:
        Mindful movement adjustments for your energy:
        Restorative techniques from your heritage:
        
        4. MENTAL WELLNESS
        Calming practices from your cultural tradition:
        Supportive daily rituals for emotional balance:
        Mindfulness practices that honor your background:
        
        5. CYCLE INSIGHTS
        Understanding your unique pattern:
        Gentle adjustments for your ${data.cycleRegularity} cycle:
        Preparing for your next phase with care:
        
        Remember to format each insight as follows:
        - Keep the exact five numbered sections
        - Maintain these precise section titles
        - Use colons for subsections
        - Place each recommendation on its own line
        - Avoid bullet points or special characters
        - Keep language warm and supportive
        - Make each suggestion specific and actionable
        - Honor cultural wisdom while maintaining format
        
        Share your wisdom with compassion and understanding, keeping these format guidelines intact for clarity. Each recommendation should feel like a supportive friend offering culturally-sensitive guidance while maintaining the structured format.`;


        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const sections = parseResponse(text);


        console.log("Health insights generated successfully:", sections);

        return NextResponse.json({
            insights: sections,
            cycleContext: {
                phase: data.cyclePhase,
                day: data.dayOfCycle,
                nextPeriod: data.nextPeriod,
                symptomAnalysis
            },
            timestamp: new Date(),
            nextUpdateRecommended: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
    } catch (error) {
        console.error("Error generating health insights:", error);
        return NextResponse.json(
            { error: "Failed to generate health insights" },
            { status: 500 }
        );
    }
}

// Helper functions
function analyzeSymptoms(symptoms: Symptom[]) {
    const analysis = {
        mostCommon: [] as string[],
        severityTrends: {} as Record<string, number>,
        recentChanges: [] as string[],
        categories: {
            physical: [] as string[],
            emotional: [] as string[],
            other: [] as string[]
        }
    };

    // Count symptom occurrences and calculate average severities
    const symptomCounts = new Map<string, number>();
    const severityTotals = new Map<string, number>();

    symptoms.forEach(symptom => {
        // Count occurrences
        symptomCounts.set(symptom.type, (symptomCounts.get(symptom.type) || 0) + 1);

        // Sum severities
        severityTotals.set(symptom.type, (severityTotals.get(symptom.type) || 0) + symptom.severity);

        // Categorize symptoms
        analysis.categories[symptom.category as keyof typeof analysis.categories].push(symptom.type);
    });

    // Calculate most common symptoms
    analysis.mostCommon = Array.from(symptomCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => type);

    // Calculate average severity for each symptom
    for (const [type, count] of symptomCounts) {
        const totalSeverity = severityTotals.get(type) || 0;
        analysis.severityTrends[type] = totalSeverity / count;
    }

    return analysis;
}

function formatSymptomAnalysis(analysis: ReturnType<typeof analyzeSymptoms>) {
    return `Most Common Symptoms: ${analysis.mostCommon.join(", ")}
Average Severity Trends:
${Object.entries(analysis.severityTrends)
            .map(([symptom, severity]) => `- ${symptom}: ${severity.toFixed(1)}/3`)
            .join("\n")}

Symptom Categories:
Physical: ${analysis.categories.physical.join(", ")}
Emotional: ${analysis.categories.emotional.join(", ")}
${analysis.categories.other.length ? `Other: ${analysis.categories.other.join(", ")}` : ""}`;
}

function parseResponse(text: string) {
    const sections: { [key: string]: string[] } = {};
    let currentSection = "";
    let currentSubsection: string[] = [];

    // Split by double newlines to separate major sections
    const lines = text.split("\n").map(line => line.trim());

    lines.forEach(line => {
        // Skip empty lines
        if (!line) return;

        // Check for main section headers (e.g., "1. SYMPTOM MANAGEMENT")
        const sectionMatch = line.match(/^\*?\*?\d+\.\s+([^*]+)\*?\*?$/);
        if (sectionMatch) {
            if (currentSection) {
                // Save previous section
                sections[currentSection.toLowerCase()] = currentSubsection;
            }
            currentSection = sectionMatch[1].trim();
            currentSubsection = [];
            return;
        }

        // Add content to current subsection
        if (currentSection) {
            // Clean up markdown-style formatting
            const cleanedLine = line
                .replace(/\*\*/g, '')  // Remove bold markers
                .replace(/^\* /, '')   // Remove bullet points
                .replace(/^- /, '')    // Remove dashes
                .trim();

            if (cleanedLine) {
                currentSubsection.push(cleanedLine);
            }
        }
    });

    // Don't forget to add the last section
    if (currentSection && currentSubsection.length > 0) {
        sections[currentSection.toLowerCase()] = currentSubsection;
    }

    return sections;
}
