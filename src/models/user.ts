// src/models/user.ts
import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['physical', 'emotional', 'other'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        min: 1,
        max: 3,
        required: true
    },
    notes: String
}, { _id: true }); // Ensure each symptom gets an _id

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    image: String,
    googleId: String,
    detailsCompleted: {
        type: Boolean,
        default: false
    },
    // Additional fields
    age: Number,
    lastPeriodDate: Date,
    cycleRegularity: {
        type: String,
        enum: ['regular', 'irregular'],
    },
    allergies: [{
        type: String
    }],
    cycleLength: {
        type: Number,
        default: 28
    },
    periodLength: {
        type: Number,
        default: 5
    },
    symptoms: [symptomSchema]
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);