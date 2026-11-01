"use server";
import { db } from "@/src/index";
import { bookings, bookingStations, devices, gameStations } from "@/src/db/schema";
import { checkAccountType, isLoggedIn } from "@/lib/actions/authorizationCheck";
import { deviceAddSchema, updateDeviceSchema, type deviceAddInput, type updateDeviceInput } from "@/lib/validations/deviceValidation";
import { and, asc, eq, gt, inArray, lt, ne, or } from "drizzle-orm";
import { formatConsoleName } from "@/lib/utils/tools";
import { DeviceWithStations, getDeviceInputType } from "@/types/deviceTypes";

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
    const { error, data: parsed } = deviceAddSchema.safeParse(input);
    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    try {
        const result = await db.transaction(async (tx) => {
            const [insertedDevice] = await tx.insert(devices).values({
                deviceName: parsed.deviceName,
                hourlyRate: String(parsed.hourlyRate),
                maxPlayers: parsed.maxPlayers,
                type: parsed.type,
                extraConsolePrice: String(parsed.extraConsolePrice),
                supportsFiltering: false
            }).returning();

            const dataForGameStationInsert: Array<typeof gameStations.$inferInsert> = Array.from({ length: parsed.units }, (_, index) => {
                const stationLabel = "#" + String(index + 1);
                return {
                    deviceId: insertedDevice.id,
                    frontendLabel: `Station ${stationLabel}`,
                    stationLabel: `${formatConsoleName(insertedDevice.deviceName)} - Station ${stationLabel}`,
                    isActive: true
                }
            });

            await tx.insert(gameStations).values(dataForGameStationInsert);

            return insertedDevice;
        });

        return {
            success: true,
            data: result
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

    const { error, data: parsed } = updateDeviceSchema.safeParse(input);
    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    try {
        const updated = await db.update(devices).set({
            deviceName: parsed.deviceName,
            type: parsed.type,
            maxPlayers: parsed.maxPlayers,
            hourlyRate: parsed.hourlyRate !== undefined ? String(parsed.hourlyRate) : undefined,
            extraConsolePrice: parsed.extraConsolePrice !== undefined ? String(parsed.extraConsolePrice) : undefined,
        }).where(eq(devices.id, parsed.id)).returning();

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

export const getDevices = async (input?: getDeviceInputType): Promise<{
    success: boolean;
    message?: string;
    data?: DeviceWithStations[]
}> => {
    try {
        const now = new Date();

        const starting = input?.startTime ? new Date(input.startTime) : now;
        const ending = input?.endTime ? new Date(input.endTime) : new Date(starting.getTime() + 2 * 60 * 60 * 1000); //Two hours after starttime
        const [gotDevices, bookedRows] = await Promise.all([
            await db.query.devices.findMany({
                with: {
                    game_stations: true
                },
                orderBy: (devices, { asc }) => [asc(devices.deviceName)]
            }),

            await db.select({ stationId: bookingStations.gameStationId }).from(bookingStations)
                .innerJoin(bookings, eq(bookings.id, bookingStations.bookingId))
                .where(
                    and(
                        eq(bookings.isArchived, false),
                        inArray(bookings.bookingStatus, ["hold", "pending", "confirmed"]),
                        or(
                            ne(bookings.bookingStatus, "hold"),
                            gt(bookings.holdExpiresAt, now)
                        ),
                        lt(bookings.startTime, ending),
                        gt(bookings.endTime, starting)
                    )
                )
        ]);

        const bookedStations = new Set(bookedRows.map(row => row.stationId));

        const data: DeviceWithStations[] = gotDevices.map((device) => ({
            ...device,
            game_stations: device.game_stations.map((station) => ({
                ...station,
                isBooked: bookedStations.has(station.id)
            }))
        }))

        return {
            success: true,
            data
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