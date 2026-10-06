"use server";
import { db } from "@/src/index";
import { devices } from "@/src/db/schema";
import { checkAccountType, isLoggedIn } from "@/lib/actions/authorizationCheck";
import type { deviceAddInput, updateDeviceInput } from "@/lib/validations/deviceValidation";
import { eq } from "drizzle-orm";

export const addDevice = async (input: deviceAddInput): Promise<{
    success: boolean;
    message?: string;
    data?: typeof devices.$inferSelect;
}> => {
    const user = await isLoggedIn();
    if (!user) {
        return { success: false, message: "Please Log in first" }
    };
    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return {
            success: false,
            message: "Only admins can add devices"
        }
    };

    try {
        const insertedDevice = await db.insert(devices).values({
            units: input.units,
            deviceName: input.deviceName,
            hourlyRate: String(input.hourlyRate),
            maxPlayers: input.maxPlayers,
            type: input.type,
            extraConsolePrice: String(input.extraConsolePrice)
        }).returning();

        return {
            success: true,
            data: insertedDevice[0]
        };
    }
    catch (err) {
        console.error("[addDevice]:", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const updateDevice = async (input: updateDeviceInput): Promise<{
    success: boolean;
    data?: typeof devices.$inferSelect;
    message?: string;
}> => {
    const user = await isLoggedIn();
    if (!user) {
        return {
            success: false,
            message: "Please log in first"
        }
    };
    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return {
            success: false,
            message: "You are not allowed to do this operation"
        }
    };

    try {
        const updated = await db.update(devices).set({
            units: input.units,
            deviceName: input.deviceName,
            type: input.type,
            maxPlayers: input.maxPlayers,
            hourlyRate: input.hourlyRate !== undefined ? String(input.hourlyRate) : undefined,
            extraConsolePrice: input.extraConsolePrice !== undefined ? String(input.extraConsolePrice) : undefined,
        }).where(eq(devices.id, input.id)).returning();

        if (!updated) {
            return { success: false, message: "Device not found" };
        };
        return {
            success: true,
            data: updated[0]
        };
    }
    catch (err) {
        console.error("[updateDevice]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const deleteDevice = async (id: string): Promise<{
    success: boolean;
    message?: string;
    deletedDeviceId?: string;
}> => {
    const user = await isLoggedIn();
    if (!user) {
        return {
            success: false,
            message: "Please log in first"
        }
    };
    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return {
            success: false,
            message: "You are not allowed to do this operation"
        }
    };

    try {
        const deleted = await db.delete(devices).where(eq(devices.id, id)).returning({ id: devices.id });
        return {
            success: true,
            deletedDeviceId: deleted[0].id
        };
    }
    catch (err) {
        console.error("[deleteDevice]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getDeviceTypes = async (): Promise<{
    data?: Array<typeof devices.$inferSelect.type>;
    success: boolean;
    message?: string;
}> => {
    try {
        const deviceTypes = await db.selectDistinct({ type: devices.type }).from(devices);
        const typesAvailable = deviceTypes.map(d => d.type);
        return {
            success: true,
            data: typesAvailable
        }
    }
    catch (err) {
        console.error("[getDeviceTypes]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getDevices = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof devices.$inferSelect>;
}> => {
    try {
        const gotDevices = await db.select().from(devices);
        return {
            success: true,
            data: gotDevices
        };
    }
    catch (err) {
        console.error("[getDevices]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

