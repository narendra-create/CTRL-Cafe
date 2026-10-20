"use server";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/src/index";
import { checkAccountType, isLoggedIn } from "@/lib/actions/authorizationCheck";
import { addSlotSchema, updateSlotSchema, type addSlotInput, type updateSlotInput } from "@/lib/validations/timeslotValidation";

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

    const { error, data: parsed } = addSlotSchema.safeParse(input);
    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    try {
        const addedSlot = await db.insert(timeSlots).values({
            startTime: parsed.startTime,
            endTime: parsed.endTime,
            availableDevices: parsed.availableDevices,
            timeZone: parsed.timeZone
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

export const removeSlot = async (id: string): Promise<{
    success: boolean;
    message?: string;
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
        const deleted = await db.delete(timeSlots).where(eq(timeSlots.id, id));
        if (!deleted) {
            return {
                success: false,
                message: "TimeSlot Not found"
            }
        };

        return {
            success: true
        }
    }
    catch (err) {
        console.error("[removeSlot]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getSlots = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof timeSlots.$inferSelect>;
}> => {
    try {
        const gotTimeSlots = await db.select().from(timeSlots);
        return {
            success: true,
            data: gotTimeSlots
        }
    }
    catch (err) {
        console.error("[getSlots]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const updateSlot = async (id: string, input: updateSlotInput): Promise<{
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

    const { error, data: parsed } = updateSlotSchema.safeParse(input);
    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    try {
        const updated = await db.update(timeSlots).set({
            availableDevices: parsed.availableDevices
        }).returning();
        return {
            success: true,
            data: updated[0]
        }
    }
    catch (err) {
        console.error("[updateSlot]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};
