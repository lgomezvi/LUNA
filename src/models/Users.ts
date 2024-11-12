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
    // Add any other fields you need
}, {
    timestamps: true,
});

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;