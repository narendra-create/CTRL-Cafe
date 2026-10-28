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
