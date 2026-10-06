"use server";
import { timeSlots } from "@/src/db/schema";
import { db } from "@/src/index";
import { checkAccountType, isLoggedIn } from "@/lib/actions/authorizationCheck";
import type { addSlotInput } from "@/lib/validations/timeslotValidation";

export const addSlot = async (input: addSlotInput): Promise<{
    success: boolean;
    message?: string;
    data?: typeof timeSlots.$inferSelect;
}> => {
    const user = await isLoggedIn();
    if (!user) {
        return {
            success: false,
            message: "Please Log in First"
        }
    };
    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return {
            success: false,
            message: "This is admins only action"
        }
    };

    try {
        const addedSlot = await db.insert(timeSlots).values({
            startTime: input.startTime,
            endTime: input.endTime,
            availableDevices: input.availableDevices,
            timeZone: input.timeZone
        }).returning();

        return {
            success: true,
            data: addedSlot[0]
        }
    }
    catch (err) {
        console.error("[addSlot]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};