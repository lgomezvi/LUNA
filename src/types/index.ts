import { DefaultSession } from 'next-auth';

// Extend next-auth session type
declare module 'next-auth' {
    interface Session {
        user?: {
            id?: string;
        } & DefaultSession['user'];
    }
}

// MongoDB model types
export interface IUser {
    email: string;
    name?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// User model type
export interface UserData {
    _id: string
    email: string
    name?: string
    image?: string
    googleId: string
    detailsCompleted: boolean
    age?: number
    lastPeriodDate?: Date
    cycleRegularity?: 'regular' | 'irregular'
    allergies?: string[]
    cycleLength?: number
    periodLength?: number
    createdAt: Date
    updatedAt: Date
}

export interface CyclePhase {
    name: string;
    day: number;
    description: string;
    nutrition: string[];
    exercise: string[];
    color: string; // Tailwind class for text color
}

export interface CycleStatus {
    currentPhase: CyclePhase;
    dayOfCycle: number;
    nextPeriod: number;
    isIrregular: boolean;
}