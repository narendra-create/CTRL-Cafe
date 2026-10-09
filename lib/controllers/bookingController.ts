"use server";
import { db } from "@/src/index";
import { bookings, profiles } from "@/src/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { createClient } from "@/lib/supabase/serverClient";

export const getCurrentBookings = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof bookings.$inferSelect>;
}> => {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
    if (error) {
        throw new Error(error.message);
    };
    if (!user) {
        return {
            success: false,
            message: "Please Log in first"
        }
    };

    const [dbuser] = await db.select({ userId: profiles.id, accountType: profiles.accountType }).from(profiles).where(eq(profiles.id, user.claims.sub));

    if (!dbuser) {
        return {
            success: false,
            message: "User Account not found"
        }
    }
    if (dbuser.accountType === "admin") {
        return {
            success: false,
            message: "This is user only operation, admins are not allowed to do this"
        }
    };

    const now = new Date();

    try {
        const gotBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            gte(bookings.endTime, now)
        ));

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
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
    if (error) {
        throw new Error(error.message);
    };
    if (!user) {
        return {
            success: false,
            message: "Please Log in first"
        }
    };

    const [dbuser] = await db.select({ userId: profiles.id, accountType: profiles.accountType }).from(profiles).where(eq(profiles.id, user.claims.sub));

    if (!dbuser) {
        return {
            success: false,
            message: "User Account not found"
        }
    }
    if (dbuser.accountType === "admin") {
        return {
            success: false,
            message: "This is user only operation, admins are not allowed to do this"
        }
    };

    const now = new Date();

    try {
        const pastBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            lte(bookings.endTime, now)
        ));

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