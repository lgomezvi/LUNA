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
    cyclePhase: string;
    dayOfCycle: number;
    symptoms: Symptom[];
    allergies: string[];
    preferences: {
        diet?: string;
        exercise?: string;
        lifestyle?: string;
    };
    culturalContext?: string;
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

        // Get recent symptoms (last 7 days)
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 7);

        const recentSymptoms = user.symptoms
            .filter((s: Symptom) => new Date(s.date) >= recentDate)
            .sort((a: Symptom, b: Symptom) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Analyze symptom patterns
        const symptomAnalysis = analyzeSymptoms(recentSymptoms);

        console.log("Symptom analysis:", symptomAnalysis);
    

        const data: HealthContext = await request.json();

        // Enhanced prompt with symptom analysis
        const prompt = `As a women's health expert, provide personalized health insights and recommendations. 
Consider this detailed context:

CYCLE INFORMATION:
- Current Phase: ${data.cyclePhase}
- Day of Cycle: ${data.dayOfCycle}

RECENT SYMPTOM PATTERNS:
${formatSymptomAnalysis(symptomAnalysis)}

HEALTH CONTEXT:
- Allergies: ${user.allergies?.join(", ") || "None reported"}
- Cycle Regularity: ${user.cycleRegularity || "Not specified"}
- Cycle Length: ${user.cycleLength} days
${data.preferences.diet ? `- Dietary Preferences: ${data.preferences.diet}` : ''}
${data.preferences.exercise ? `- Exercise Preferences: ${data.preferences.exercise}` : ''}
${data.culturalContext ? `- Cultural Context: ${data.culturalContext}` : ''}

Based on the provided context, please provide detailed advice in these specific sections:

1. SYMPTOM MANAGEMENT
- Current symptom recommendations
- Preventive measures
- Warning signs to watch for

2. NUTRITION PLAN
- Phase-specific foods to eat
- Foods to avoid
- Supplement considerations

3. PHYSICAL WELLNESS
- Recommended exercises
- Activity modifications
- Recovery techniques

4. MENTAL WELLNESS
- Stress management
- Mood support
- Mindfulness practices

5. CYCLE INSIGHTS
- Pattern analysis
- Lifestyle adjustments
- Next phase preparation

Please provide clear, practical advice for each bullet point and include scientific reasoning where relevant. Format each section with the number and title in capital letters, followed by bullet points for specific recommendations.`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Generated health insights:", text);

        // Enhanced response parsing
        const sections = parseResponse(text);
        console.log("Parsed health insights:", sections);

        return NextResponse.json({
            insights: sections,
            cycleContext: {
                phase: data.cyclePhase,
                day: data.dayOfCycle,
                symptomAnalysis
            },
            timestamp: new Date(),
            nextUpdateRecommended: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
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
