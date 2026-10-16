import { db } from "@/src/index";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { addGamesSchema, type addGamesInput } from "@/lib/validations/gamesValidation";
import { availableGames, deviceGames, devices } from "@/src/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { DeviceWithInstalledGames } from "@/types/gameTypes";

export const linkGames = async (input: addGamesInput): Promise<{
    success: boolean;
    message?: string;
}> => {
    const { dbuser, error } = await resolveAuthenticatedUser("admin");
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

