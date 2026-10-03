"use server";
import { resendClient } from "@/lib/setup-files/resend-client";
import { redis } from "@/lib/setup-files/redis";
import { getkey, generateOTP } from "@/lib/utils/tools";
import { otpVerificationEmail } from "@/app/components/email-templates/otp-verification";
import { createClient } from "@/lib/supabase/serverClient";

export async function sendOtp() {
    //Getting email
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log(error, "From sendOtp")
        return { success: false }
    };

    const email = user.email!;
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
        userName: email
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
        }
    }
    catch {
        await redis.del(rediskey);
        return { success: false, error: "Failed to send email. Try again." };
    }
}