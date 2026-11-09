import { bookings } from "@/src/db/schema";

export interface BookingDetailsSnack {
    name: string;
    qty: number;
    unitPrice: string;
}
export interface BookingDetailsData {
    id: string;
    status: typeof bookings.$inferSelect["bookingStatus"]; // "hold" | "pending" | "confirmed" | "cancelled" | "completed"
    startTime: Date;
    endTime: Date;
    totalAmount: string;
    playersCount: number;
    holdExpiresAt: Date | null;
    razorpayOrderId: string | null;
    deviceName: string;
    hourlyRate: string;
    foodItems: BookingDetailsSnack[];
}
export interface BookingDetailsResponse {
    success: boolean;
    message?: string;
    data?: BookingDetailsData;
};

/* Booking Page Types */
export type DeviceType = "CONSOLE" | "PC" | "ARCADE" | "VR";

export interface Arena {
    key: DeviceType;
    label: string;
    subLabel: string;
    eyebrow: string;
    description: string;
    tags: string[];
    price: number;
    totalUnits: number;
    maxPlayers: number;
}

/* device index → player count */
export interface DeviceSelection {
    [deviceIndex: number]: number;
}

/* all selections across arenas: arena key → DeviceSelection */
export type AllSelections = Partial<Record<DeviceType, DeviceSelection>>;

export interface StoredBookingDraft {
    version: 1;
    selectedArena: "CONSOLE" | "PC" | "ARCADE" | "VR";
    date: string;       // e.g. "2026-11-10"
    startTime: string;  // e.g. "14:00"
    endTime: string;    // e.g. "16:00"
    // Storing only station IDs and player counts
    selectedStations: Array<{
        stationId: string;
        players: number;
    }>;
    // Storing only food IDs and quantities
    selectedFoods: Array<{
        foodId: string;
        quantity: number;
    }>;
}