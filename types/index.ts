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