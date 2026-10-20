"use server";
import { db } from "@/src/index";
import { bookings, devices, profiles } from "@/src/db/schema";
import { eq, and, gte, lt, asc, desc, sql, inArray } from "drizzle-orm";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { SeatHoldeInput, seatHoldSchema } from "@/lib/validations/bookingValidation";

//Helping Functions
const addPoints = async (userId: string, bookingId: string): Promise<{
    success: boolean;
    message?: string;
    currentPoints?: string;
}> => {
    try {
        const result = await db.transaction(async (tx) => {
            const [booking] = await tx.update(bookings).set({ rewardGranted: true }).where(and(
                eq(bookings.id, bookingId),
                eq(bookings.rewardGranted, false) //Prevents race condition
            )).returning({ id: bookings.id });

            if (!booking) return { success: false, message: "Points already granted for this booking" };

            const [profileresult] = await tx.update(profiles).set({
                rewardPoints: sql`${profiles.rewardPoints} + 10`
            }).where(eq(profiles.id, userId)).returning({ currentPoints: profiles.rewardPoints });

            return {
                success: true,
                currentPoints: String(profileresult.currentPoints)
            }
        });

        return result;
    }
    catch (err) {
        console.error("[addPoints server action]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

const redeemPoints = async (): Promise<{
    success: boolean;
    currentPoints?: string;
    message?: string;
}> => {
    const [findUser] = await db.select({ availablePoints: profiles.rewardPoints }).from(profiles);
    if (!findUser) return { success: false, message: "User Not Found" };
    if (findUser.availablePoints < 65) {
        return {
            success: false,
            message: "Minimum 65 points required"
        }
    };

    try {
        const [profile] = await db.update(profiles).set({ rewardPoints: sql`${profiles.rewardPoints} - 65` }).returning({ pointsLeft: profiles.rewardPoints });
        return {
            success: true,
            currentPoints: profile.pointsLeft.toString()
        }
    }
    catch (err) {
        console.error("[redeemPoints server action]: ", err);
        return {
            success: false,
            message: "Server Error"
        };
    }
}

//Main functions
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
};

export const holdSeat = async (input: SeatHoldeInput): Promise<{
    success: boolean;
    message?: string;
    data?: any
}> => {
    try {
        //Verify authentication
        const { dbuser, error } = await resolveAuthenticatedUser("user");
        if (error) return { success: false, message: error.message };
        //Parsing
        const { error: zoderror, data: parsed } = seatHoldSchema.safeParse(input);
        if (zoderror) { return { success: false, message: zoderror.message } };
        //Input Checks
        const now = new Date();
        const convertedStartTime = new Date(parsed.startTime);
        const convertedEndTime = new Date(parsed.endTime);
        const durationInHours = (convertedEndTime.getTime() - convertedStartTime.getTime()) / (1000 * 60 * 60);

        if (convertedStartTime >= convertedEndTime) {
            return {
                success: false,
                message: "Endtime must be after StartTime"
            }
        };
        if (convertedStartTime < now) {
            return {
                success: false,
                message: "StartTime must be in future"
            }
        };
        if (durationInHours < 0.5) {
            return {
                success: false,
                message: "Minimum duration must be 30 minutes"
            }
        };

        const [bookedDevicecheck] = await db.select().from(devices).where(eq(devices.id, parsed.bookedDevice));
        if (!bookedDevicecheck) {
            return {
                success: false,
                message: "Device Not Found"
            }
        };
        //Calculate price
        // Base price = duration * hourlyRate
        const totalAmount = (durationInHours * Number(bookedDevicecheck.hourlyRate)).toFixed(2);
        //Run cleanup & Insert new booking with hold
        const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const newBooking = await db.transaction(async (tx) => {
            await tx.update(bookings)
                .set({ bookingStatus: "cancelled" })
                .where(and(
                    inArray(bookings.bookingStatus, ["hold", "pending"]),
                    lt(bookings.holdExpiresAt, now)
                ));
            const [insertedData] = await tx.insert(bookings).values({
                bookedDevice: bookedDevicecheck.id,
                endTime: convertedEndTime,
                startTime: convertedStartTime,
                totalAmount: totalAmount,
                userId: dbuser.userId,
                bookingStatus: "hold",
                holdExpiresAt: holdExpiresAt,
                playersCount: parsed.playersCount
            }).returning();

            return insertedData;
        });

        return {
            success: true,
            data: newBooking,
            message: `Seat Held until for 5 Minutes`
        };
    }
    catch (err: any) {
        const code = err?.code ?? err?.cause?.code;
        if (code === "23P01") {
            return {
                success: false,
                message: "This device is already held or booked for the selected time slot.",
            };
        };

        console.error("[holdSeat]: ", err);
        return {
            success: false,
            message: "Something went wrong while holding the seat."
        }
    }
}