// src/app/api/user/route.ts
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/models/user"
import { auth } from "@/lib/auth"


export async function POST(request: Request) {
    try {
        const userData = await request.json()
        await connectDB()

        const userExists = await User.findOne({ email: userData.email })

        if (!userExists) {
            await User.create(userData)
        } else {
            await User.findOneAndUpdate(
                { email: userData.email },
                userData,
                { new: true }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error managing user:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function GET() {
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

        // Convert MongoDB document to plain object and clean up sensitive/unnecessary fields
        const userData = {
            name: user.name,
            email: user.email,
            detailsCompleted: user.detailsCompleted,
            lastPeriodDate: user.lastPeriodDate,
            cycleRegularity: user.cycleRegularity,
            allergies: user.allergies,
            cycleLength: user.cycleLength
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

        // Clean up the response data
        const userData = {
            name: updatedUser.name,
            email: updatedUser.email,
            detailsCompleted: updatedUser.detailsCompleted,
            lastPeriodDate: updatedUser.lastPeriodDate,
            cycleRegularity: updatedUser.cycleRegularity,
            allergies: updatedUser.allergies,
            cycleLength: updatedUser.cycleLength
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