// src/lib/mongodb.ts
import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';

// Define the cache interface
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose cache
declare global {
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        console.log('Using existing MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        } as mongoose.ConnectOptions;

        console.log('Creating new MongoDB connection');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
            console.log('MongoDB connected successfully');
            return mongoose;
        });
    } else {
        console.log('Using existing connection promise');
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error('MongoDB connection error:', error);
        throw error;
    }

    // Add event listeners for connection status
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        cached.conn = null;
        cached.promise = null;
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        cached.conn = null;
        cached.promise = null;
    });

    return cached.conn;
}

export default connectDB;