// src/models/user.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Auth fields
    email: { type: String, required: true, unique: true },
    name: String,
    image: String,
    googleId: String,

    // Basic Information
    age: Number,
    languagePreference: String,
    culturalBackground: String,
    dietaryPreference: String,

    // Health Information
    lastPeriodDate: Date,
    cycleRegularity: {
        type: String,
        enum: ['regular', 'irregular']
    },
    cycleLength: {
        type: Number,
        default: 28
    },
    periodLength: {
        type: Number,
        default: 5
    },

    // Additional Information
    allergies: [String],
    symptoms: [{
        date: Date,
        type: String,
        severity: Number,
        notes: String
    }],
    exercisePreferences: [String],
    healthGoals: String,
    hasHealthConditions: Boolean,
    healthConditions: String,
    detailsCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
