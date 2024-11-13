// src/app/api/user/route.ts
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/models/user"
import { auth } from "@/lib/auth"
import { json } from "stream/consumers";


export async function GET() {
    try {
        // Run auth and DB connection in parallel
        const [session, _] = await Promise.all([
            auth(),
            connectDB()
        ]);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use lean() for faster queries
        const user = await User.findOne({
            email: session.user.email
        }).lean();

        if (!user) {
            const newUser = await User.create({
                email: session.user.email,
                name: session.user.name,
                detailsCompleted: false,
            });
            return NextResponse.json(newUser);
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        console.log('POST /api/user - Starting request');

        await connectDB().catch(error => {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        });

        const session = await auth();
        if (!session?.user?.email) {
            console.log('POST /api/user - No session or email');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userData = await request.json();
        console.log('POST /api/user - User data to save:', userData);

        // Find the user first
        const existingUser = await User.findOne({ email: userData.email });

        // Prepare update that preserves existing data
        const updateData = {
            name: userData.name || existingUser?.name || '',
            image: userData.image || existingUser?.image || '',
            googleId: userData.googleId || existingUser?.googleId || '',
            email: userData.email,
            // Preserve these fields if they exist
            detailsCompleted: existingUser?.detailsCompleted || false,
            age: existingUser?.age,
            languagePreference: existingUser?.languagePreference,
            culturalBackground: existingUser?.culturalBackground,
            dietaryPreference: existingUser?.dietaryPreference,
            lastPeriodDate: existingUser?.lastPeriodDate,
            cycleRegularity: existingUser?.cycleRegularity,
            cycleLength: existingUser?.cycleLength || 28,
            periodLength: existingUser?.periodLength || 5,
            allergies: existingUser?.allergies || [],
            exercisePreferences: existingUser?.exercisePreferences || [],
            healthGoals: existingUser?.healthGoals,
            hasHealthConditions: existingUser?.hasHealthConditions,
            healthConditions: existingUser?.healthConditions,
        };

        const user = await User.findOneAndUpdate(
            { email: userData.email },
            updateData,
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        console.log('POST /api/user - User saved successfully:', {
            email: user.email,
            detailsCompleted: user.detailsCompleted
        });

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                detailsCompleted: user.detailsCompleted
            }
        });
    } catch (error) {
        console.error('POST /api/user - Error:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const requestId = Math.random().toString(36).substring(7);

    try {
        console.log(`[${requestId}] PUT /api/user - Starting request`);

        const session = await auth();
        if (!session?.user?.email) {
            console.log(`[${requestId}] Unauthorized - No session found`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log(`[${requestId}] User authenticated:`, session.user.email);

        const data = await request.json();
        await connectDB();

        console.log(`[${requestId}] Attempting to update user with data:`, {
            email: session.user.email,
            age: data.age,
            culturalBackground: data.culturalBackground,
            dietaryPreference: data.dietaryPreference,
            lastPeriodDate: data.lastPeriodDate,
            cycleRegularity: data.cycleRegularity,
            exercisePreferences: data.exercisePreferences
        });

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    age: data.age,
                    languagePreference: data.languagePreference,
                    culturalBackground: data.culturalBackground,
                    dietaryPreference: data.dietaryPreference,
                    lastPeriodDate: data.lastPeriodDate,
                    cycleRegularity: data.cycleRegularity,
                    cycleLength: data.cycleLength || 28,
                    periodLength: data.periodLength || 5,
                    allergies: data.allergies || [],
                    exercisePreferences: data.exercisePreferences || [],
                    healthGoals: data.healthGoals || '',
                    hasHealthConditions: data.hasHealthConditions || false,
                    healthConditions: data.healthConditions || '',
                    detailsCompleted: true
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            console.log(`[${requestId}] User not found:`, session.user.email);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        console.log(`[${requestId}] User updated successfully:`, {
            email: updatedUser.email,
            age: updatedUser.age,
            detailsCompleted: updatedUser.detailsCompleted
        });

        const response = {
            name: updatedUser.name,
            email: updatedUser.email,
            age: updatedUser.age,
            languagePreference: updatedUser.languagePreference,
            culturalBackground: updatedUser.culturalBackground,
            dietaryPreference: updatedUser.dietaryPreference,
            lastPeriodDate: updatedUser.lastPeriodDate,
            cycleRegularity: updatedUser.cycleRegularity,
            cycleLength: updatedUser.cycleLength,
            periodLength: updatedUser.periodLength,
            allergies: updatedUser.allergies,
            exercisePreferences: updatedUser.exercisePreferences,
            healthGoals: updatedUser.healthGoals,
            hasHealthConditions: updatedUser.hasHealthConditions,
            healthConditions: updatedUser.healthConditions,
            detailsCompleted: updatedUser.detailsCompleted
        };

        console.log(`[${requestId}] Request completed successfully`);
        return NextResponse.json(response);

    } catch (error) {
        console.error(`[${requestId}] Error updating user:`, error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}