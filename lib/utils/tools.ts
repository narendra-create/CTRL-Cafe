import { randomInt } from "node:crypto";

export function generateOTP(): string {
    return randomInt(100000, 1000000).toString();
}

export function getkey(
    type: "otp" | "seat" | "user",
    email: string
): string {
    if (!email) {
        throw new Error("Please provide Email");
    }

    return `${type}:${email}:rg`;
}

export function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .join("");
}

export function rupeesToPaise(value: string | number): number {
    const input = String(value).trim();
    const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input);

    if (!match) {
        throw new TypeError(`Invalid rupee amount: ${input}`);
    }

    const rupees = Number(match[1]);
    const paisePart = Number((match[2] ?? "").padEnd(2, "0"));
    const totalPaise = rupees * 100 + paisePart;

    if (!Number.isSafeInteger(totalPaise)) {
        throw new RangeError("Amount exceeds the safe integer range");
    }

    return totalPaise;
}

export function paiseToRupees(paise: number): string {
    if (!Number.isSafeInteger(paise)) {
        throw new TypeError("Paise must be a safe integer");
    }

    if (paise < 0) {
        throw new RangeError("Paise cannot be negative");
    }

    const rupees = Math.floor(paise / 100);
    const remainder = String(paise % 100).padStart(2, "0");

    return `${rupees}.${remainder}`;
}