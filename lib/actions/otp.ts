"use server";
import { resendClient } from "@/lib/setup-files/resend-client";
import { redis } from "@/lib/setup-files/redis";
import { getkey, generateOTP } from "@/lib/utils/tools";
import { otpVerificationEmail } from "@/app/components/email-templates/otp-verification";

export async function sendOtp(email: string, name: string): Promise<{ success: boolean; error?: string }> {
    //Checking if email is correct
    const key = email.trim().toLowerCase();
    if (!key || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
        return { success: false, error: "Invalid email address." };
    };

    //Generating 6 digit otp
    const otp = generateOTP();

    //Storing otp
    const rediskey = getkey("otp", email);
    await redis.set(rediskey, otp, { ex: 600 });

    //Sending in email
    const { html, text, subject } = otpVerificationEmail({
        otp: otp,
        expiresInMinutes: 10,
        userName: name ?? email
    });

    try {
        const { error } = await resendClient.emails.send({
            to: email,
            from: process.env.FROM_EMAIL ?? "CTRL-CAFE <onboarding@resend.dev>",
            html: html,
            subject: subject,
            text: text
        });

        if (error) {
            await redis.del(rediskey);
            return { success: false, error: "Failed to send email. Try again." };
        };

        return { success: true }
    }
    catch {
        await redis.del(rediskey);
        return { success: false, error: "Failed to send email. Try again." };
    }
};

export async function verifyOtp(otp: string, email: string): Promise<{ success: boolean; error?: string }> {
    const rediskey = getkey("otp", email);

    const stored = await redis.get(rediskey);
    if (!stored) {
        return { success: false, error: "Code expired or was never sent. Request a new one." };
    };

    if (stored !== otp.trim()) {
        return { success: false, error: "Incorrect code. Try again." };
    };

    await redis.del(rediskey);
    return { success: true };
}