// src/models/user.ts
import mongoose from 'mongoose';

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
    }
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);