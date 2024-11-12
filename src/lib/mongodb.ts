// src/lib/mongodb.ts
import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const options = {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        } as mongoose.ConnectOptions;

        await mongoose.connect(MONGODB_URI, options);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export default connectDB;