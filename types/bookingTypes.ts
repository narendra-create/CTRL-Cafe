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
}