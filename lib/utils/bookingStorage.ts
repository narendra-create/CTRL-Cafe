import type { StoredBookingDraft } from "@/types/bookingTypes";
import { getIndiaDateKey } from "@/lib/utils/tools";

export const BOOKING_DRAFT_KEY = "ctrl_cafe_booking_draft_v1";

export const saveBookingDraft = (draft: StoredBookingDraft) => {
    if (typeof window === "undefined") {
        return;
    };

    try {
        localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
    }
    catch (err) {
        console.error("Failed To save Booking Details in localstorage", err)
    }
};

export const loadBookingDraft = (): StoredBookingDraft | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(BOOKING_DRAFT_KEY);
        if (!raw) return null;
        const parsed: StoredBookingDraft = JSON.parse(raw);

        const today = getIndiaDateKey();
        if (parsed.date < today) {
            parsed.date = today
        };

        return parsed
    }
    catch (err) {
        console.error("Failed to load data from localstorage", err)
        return null;
    }
};

export const removeBookingDraft = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(BOOKING_DRAFT_KEY);
}