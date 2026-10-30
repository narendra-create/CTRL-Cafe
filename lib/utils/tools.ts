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
};

// Formats Date to: "1 Jan 2026" or "22 Oct 2026"
export const formatToNormalDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata", // Ensures local Indian timezone even on UTC cloud servers
    }).format(new Date(date));
};

// Formats Time to: "6 pm" (if :00) or "6:35 pm"
export const formatToNormalTime = (date: Date): string => {
    const d = new Date(date);

    // Check if minutes are 0 (e.g. 6:00 -> 6 pm, but 6:35 -> 6:35 pm)
    const hasMinutes = d.getMinutes() !== 0;

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: hasMinutes ? "2-digit" : undefined,
        hour12: true,
        timeZone: "Asia/Kolkata",
    })
        .format(d)
        .toLowerCase();
};


// lib/booking-date.ts

export function getIndiaDateKey(now: Date = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);

    const part = (type: string) =>
        parts.find((item) => item.type === type)?.value ?? "";

    return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isValidDateKey(value: unknown): value is string {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    // Validate the actual calendar date, not just its format.
    const parsed = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
    );
}

export function isBookableDate(
    value: unknown,
    today = getIndiaDateKey(),
): value is string {
    return isValidDateKey(value) && value >= today;
};

export function getOperatingHours(date: string) {
    // Parse YYYY-MM-DD as a local calendar date.
    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = new Date(
        Date.UTC(year, month - 1, day),
    ).getUTCDay();

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return {
        open: isWeekend ? 9 * 60 : 10 * 60,
        close: isWeekend ? 22 * 60 : 20 * 60,
        isWeekend,
    };
}

export function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function formatTimeLabel(value: string): string {
    const [hours, minutes] = value.split(":").map(Number);
    const displayHours = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";

    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function createTimeSlots(start: number, end: number) {
    const slots: { value: string; label: string }[] = [];

    for (let minute = start; minute <= end; minute += 30) {
        const value = minutesToTime(minute);

        slots.push({
            value,
            label: formatTimeLabel(value),
        });
    }

    return slots;
}

export function toMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

//Function for generating Station labels
const CONSOLE_ALIASES: Record<string, string> = {
    // PlayStation
    playstation2: "PS2",
    ps2: "PS2",
    playstation3: "PS3",
    ps3: "PS3",
    playstation4: "PS4",
    ps4: "PS4",
    playstation4pro: "PS4P",
    ps4pro: "PS4P",
    playstation5: "PS5",
    ps5: "PS5",
    playstation5pro: "PS5P",
    ps5pro: "PS5P",

    // Xbox
    xbox360: "X360",
    xboxone: "XBO",
    xbox1: "XBO",
    xbone: "XBO",
    xbosone: "XBO",
    xboxseriesx: "XSX",
    xboxseriess: "XSS",

    // Nintendo
    nintendoswitch: "NS",
    switch: "NS",
    nintendoswitcholed: "NSO",
    switcholed: "NSO",
    nintendoswitch2: "NS2",
    switch2: "NS2",
    switchlite: "NSL",

    // Others
    steamdeck: "SD",
};

export function formatConsoleName(input: string): string {
    if (!input?.trim()) return "UNK";

    const normalized = input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    // Known console aliases
    if (CONSOLE_ALIASES[normalized]) {
        return CONSOLE_ALIASES[normalized];
    }

    // Extract alphabetic words and numbers
    const words = input.match(/[a-z]+/gi) ?? [];
    const numbers = input.match(/\d+/g) ?? [];

    if (!words.length) return "UNK";

    // Generate fallback abbreviation
    const abbreviation =
        words.length === 1
            ? words[0].slice(0, 3)
            : words.map((word) => word[0]).join("").slice(0, 3);

    return (abbreviation + numbers.join("")).toUpperCase();
};