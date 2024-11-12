// models/user.ts
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
    // Add any other fields you need
}, {
    timestamps: true,

});

export const User = mongoose.models.User || mongoose.model('User', userSchema);