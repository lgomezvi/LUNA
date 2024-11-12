// src/app/api/user/route.ts
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/models/user"

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