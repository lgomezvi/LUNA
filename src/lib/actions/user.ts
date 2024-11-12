// src/lib/actions/user.ts
'use server'

import connectDB from "@/lib/mongodb"
import { User } from "@/models/user"

export async function createOrUpdateUser(userData: {
    email: string,
    name?: string,
    image?: string,
    googleId?: string
}) {
    try {
        await connectDB()

        const userExists = await User.findOne({ email: userData.email })

        if (!userExists) {
            return await User.create(userData)
        }

        return await User.findOneAndUpdate(
            { email: userData.email },
            userData,
            { new: true }
        )
    } catch (error) {
        console.error('Error managing user:', error)
        throw error
    }
}

export async function getUserData(email: string) {
    try {
        await connectDB()
        const user = await User.findOne({ email })
        console.log('User:', user)
        return user
    } catch (error) {
        console.error('Error fetching user:', error)
        throw error
    }
}