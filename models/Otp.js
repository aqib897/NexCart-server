import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
        index: { expires: "5m" }, // Automatically remove expired OTPs after 5 minutes
    },
}
);

export const OTP = mongoose.model("OTP", otpSchema);
