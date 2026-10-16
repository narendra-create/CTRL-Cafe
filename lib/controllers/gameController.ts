import { db } from "@/src/index";
import { createClient } from "@/lib/supabase/serverClient";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { addGamesSchema, type addGamesInput } from "@/lib/validations/gamesValidation";
import { availableGames, deviceGames } from "@/src/db/schema";
import { inArray } from "drizzle-orm";

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

            const links = rows.flatMap((r) => deviceIds.map((deviceId) => ({ deviceId: deviceId, gameId: r.name })));
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
}