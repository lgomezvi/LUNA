// src/app/api/symptoms/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/user";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const symptomData = await request.json();
        await connectDB();

        // Validate the symptom data
        if (!symptomData.type || !symptomData.category || !symptomData.severity) {
            return NextResponse.json(
                { error: "Missing required symptom data" },
                { status: 400 }
            );
        }

        const newSymptom = {
            date: new Date(symptomData.date || new Date()),
            category: symptomData.category,
            type: symptomData.type,
            severity: symptomData.severity,
            notes: symptomData.notes || ""
        };

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $push: { symptoms: newSymptom } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return the newly added symptom
        const addedSymptom = updatedUser.symptoms[updatedUser.symptoms.length - 1];
        return NextResponse.json({ success: true, symptom: addedSymptom });

    } catch (error) {
        console.error('Error logging symptom:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
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
        const user = await User.findOne({ email: session.user.email })
            .select('symptoms');

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Ensure each symptom has its _id in the response
        interface Symptom {
            _id: string;
            date: Date;
            category: string;
            type: string;
            severity: string;
            notes: string;
        }

        interface UserWithSymptoms {
            symptoms: Symptom[];
        }

        const recentSymptoms = (user.symptoms || [])
            .map((symptom: any): Symptom => ({
                _id: symptom._id.toString(), // Convert ObjectId to string
                date: new Date(symptom.date),
                category: symptom.category,
                type: symptom.type,
                severity: symptom.severity,
                notes: symptom.notes
            }))
            .sort((a: Symptom, b: Symptom) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7);

        return NextResponse.json({
            symptoms: recentSymptoms
        });
    } catch (error) {
        console.error('Error fetching symptoms:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}