import { db } from "@/src/index";
import { bookings, profiles } from "@/src/db/schema";
import { and, eq, sql } from "drizzle-orm";

//Helping Functions
export const addPoints = async (userId: string, bookingId: string): Promise<{
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

export const redeemPoints = async (userId: string): Promise<{
    success: boolean;
    currentPoints?: string;
    message?: string;
}> => {
    const [findUser] = await db.select({ availablePoints: profiles.rewardPoints }).from(profiles).where(eq(profiles.id, userId));
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