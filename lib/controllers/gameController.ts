import { db } from "@/src/index";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { addGamesSchema, UnlinkGamesInput, unLinkGamesSchema, type addGamesInput } from "@/lib/validations/gamesValidation";
import { availableGames, deviceGames, devices } from "@/src/db/schema";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { DeviceWithInstalledGames, DeviceWithSupportedGames } from "@/types/gameTypes";
import { isLoggedIn } from "@/lib/actions/authorizationCheck";

export const linkGames = async (input: addGamesInput): Promise<{
    success: boolean;
    message?: string;
}> => {
    const { error } = await resolveAuthenticatedUser("admin");
    if (error) return error;

    const parsed = addGamesSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, message: "Invalid data" };
    };

    const { deviceIds, games } = parsed.data;
    try {
        await db.transaction(async (tx) => {
            await tx.insert(availableGames).values(games).onConflictDoNothing({ target: availableGames.gameName });

            const rows = await tx.select({ id: availableGames.id, name: availableGames.gameName }).from(availableGames).where(inArray(availableGames.gameName, games.map((g) => g.gameName)));

            const links = rows.flatMap((r) => deviceIds.map((deviceId) => ({ deviceId: deviceId, gameId: r.id })));
            await tx.insert(deviceGames).values(links).onConflictDoNothing();
        });

        return {
            success: true
        }
    }
    catch (err) {
        console.error("[linkGames]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getDeviceGames = async (): Promise<{
    success: boolean;
    message?: string;
    data?: DeviceWithInstalledGames[]
}> => {
    try {
        const data = await db.select({
            id: devices.id,
            deviceName: devices.deviceName,
            type: devices.type,
            supportsFiltering: devices.supportsFiltering,
            installedGames: sql<string[]>`
            COALESCE(
            array_remove(array_agg(${availableGames.gameName}), NULL),
            ARRAY[]::text[]
          )`
        })
            .from(devices)
            .leftJoin(deviceGames, eq(devices.id, deviceGames.deviceId))
            .leftJoin(availableGames, eq(deviceGames.gameId, availableGames.id))
            .groupBy(devices.id);

        return {
            success: true,
            data: data
        }
    }
    catch (err) {
        console.error("[getDeviceGames]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const unLinkGames = async (input: UnlinkGamesInput): Promise<{
    success: boolean;
    message?: string;
}> => {
    try {
        const { error: zodError, data: parsedInput } = unLinkGamesSchema.safeParse(input);
        if (zodError) return { success: false, message: zodError.message };

        //Authentication
        const { error: authError } = await resolveAuthenticatedUser("admin");
        if (authError) return authError;

        //Finding device
        const [foundDevice] = await db.select({ id: devices.id }).from(devices).where(eq(devices.id, parsedInput.deviceId)).limit(1);
        if (!foundDevice) {
            return {
                success: false,
                message: "Device Not Found"
            }
        };

        //Unlinking games
        await db.delete(deviceGames).where(and(
            eq(deviceGames.deviceId, foundDevice.id),
            inArray(deviceGames.gameId, parsedInput.gameIds)
        ));

        return {
            success: true
        }
    }
    catch (err) {
        console.error("[unLinkGames]: ", err);
        return {
            success: false,
            message: "Something went wrong while unlinking"
        }
    }
};

export const getLinkedGames = async (): Promise<{
    success: boolean;
    message?: string;
    data?: DeviceWithSupportedGames[];
}> => {
    try {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
            return {
                success: false,
                message: "Unauthenticated user"
            }
        };

        const gotLinkedGames = await db.query.devices.findMany({
            columns: {
                deviceName: true,
                hourlyRate: true,
                id: true,
                type: true,
            },
            with: {
                supportedGames: true
            }
        });

        return {
            success: true,
            data: gotLinkedGames
        }
    }
    catch (err) {
        console.error("[getLinkedGames]: ", err);
        return {
            success: false,
            message: "Something Went wrong while fetching"
        }
    }
};

export const getAllAvailableGames = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof availableGames.$inferSelect> | null;
}> => {
    try {
        const gotGames = await db.select().from(availableGames).orderBy(asc(availableGames.gameName));

        return {
            success: true,
            data: gotGames
        }
    }
    catch (err) {
        console.error("[getAllAvailableGames]: ", err);
        return {
            success: false,
            message: "Something went wrong while fetching all games"
        }
    }
}

export const getLinkedDevice = getLinkedGames;