import { Resend } from "resend";

const globalForResend = globalThis as unknown as {
    resend: Resend | undefined;
};

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send authentication emails.");
}

export const resendClient = globalForResend.resend ?? new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
    globalForResend.resend = resendClient;
}