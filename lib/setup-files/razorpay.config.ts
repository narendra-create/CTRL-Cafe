import "server-only";
import Razorpay from "razorpay";

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    throw new Error("Missing Razorpay environment variables in .env");
};

export const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});