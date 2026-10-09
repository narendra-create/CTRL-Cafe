"use server";
import { db } from "@/src/index";
import { bookings } from "@/src/db/schema";
import { eq, and, gte, lt, asc, desc } from "drizzle-orm";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";

export const getCurrentBookings = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof bookings.$inferSelect>;
}> => {
    const { dbuser, error } = await resolveAuthenticatedUser("user");
    if (error) return error;

    const now = new Date();

    try {
        const gotBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            eq(bookings.isArchived, false),
            gte(bookings.endTime, now)
        )).orderBy(asc(bookings.startTime));

        return {
            success: true,
            data: gotBookings
        }
    }
    catch (err) {
        console.error("[getCurrentBookings]: ", err)
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getBookingHistory = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof bookings.$inferSelect>
}> => {
    const { dbuser, error } = await resolveAuthenticatedUser("user");
    if (error) return error;

    const now = new Date();

    try {
        const pastBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            eq(bookings.isArchived, false),
            lt(bookings.endTime, now)
        )).orderBy(desc(bookings.startTime));

        return {
            success: true,
            data: pastBookings
        }
    }
    catch (err) {
        console.error("[getBookingHistory]: ", err)
        return {
            success: false,
            message: "Server Error"
        }
    }
}