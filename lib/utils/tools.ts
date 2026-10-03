import { randomInt } from "node:crypto";

export function generateOTP(): string {
    return randomInt(100000, 1000000).toString();
};

export function getkey(type: "otp" | "seat" | "user", email: string) {
    if (!email) {
        throw new Error("Please provide Email")
    }

    return `${type}:${email}:rg`
}