// src/app/api/user/route.ts
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/models/user"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        // Log the start of the request
        console.log('POST /api/user - Starting request');

        const session = await auth();
        if (!session?.user?.email) {
            console.log('POST /api/user - No session or email');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Log session data
        console.log('POST /api/user - Session data:', {
            email: session.user.email,
            name: session.user.name
        });

        const userData = await request.json();
        await connectDB();

        // Log the userData
        console.log('POST /api/user - User data to save:', userData);

        // Validate required fields
        if (!userData.email) {
            console.log('POST /api/user - Missing email');
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        try {
            const user = await User.findOneAndUpdate(
                { email: userData.email },
                {
                    $setOnInsert: {
                        detailsCompleted: false,
                        allergies: [],
                        cycleLength: 28,
                        periodLength: 5,
                        symptoms: []
                    },
                    $set: {
                        name: userData.name || '',
                        image: userData.image || '',
                        googleId: userData.googleId || '',
                        email: userData.email
                    }
                },
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
        } catch (dbError) {
            console.error('POST /api/user - Database error:', dbError);
            throw dbError; // Re-throw to be caught by outer try-catch
        }
    } catch (error) {
        console.error('POST /api/user - Error:', error);
        return NextResponse.json(
            { 
                error: 'Internal Server Error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        let user = await User.findOne({ email: session.user.email });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await User.create({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                googleId: session.user.id,
                detailsCompleted: false,
                allergies: [],
                cycleLength: 28,
                periodLength: 5,
                symptoms: [] // Initialize empty symptoms array
            });
        }

        // Convert MongoDB document to plain object
        const userData = {
            name: user.name,
            email: user.email,
            detailsCompleted: user.detailsCompleted,
            age: user.age,
            lastPeriodDate: user.lastPeriodDate,
            cycleRegularity: user.cycleRegularity,
            allergies: user.allergies || [],
            cycleLength: user.cycleLength,
            periodLength: user.periodLength,
            symptoms: user.symptoms || [] // Include symptoms in response
        };

        return NextResponse.json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                ...data,
                detailsCompleted: true
            },
            { new: true }
        );

        // Clean up the response data to match our GET response
        const userData = {
            name: updatedUser.name,
            email: updatedUser.email,
            detailsCompleted: updatedUser.detailsCompleted,
            age: updatedUser.age,
            lastPeriodDate: updatedUser.lastPeriodDate,
            cycleRegularity: updatedUser.cycleRegularity,
            allergies: updatedUser.allergies || [],
            cycleLength: updatedUser.cycleLength,
            periodLength: updatedUser.periodLength
        };

        return NextResponse.json(userData);
    } catch (error) {
        console.error("Error updating user details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}