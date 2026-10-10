import * as schema from "@/src/db/schema";
import { defineRelations } from "drizzle-orm";

export const relations = defineRelations(schema, (r) => ({
    devices: {
        supportedGames: r.many.availableGames({
            from: r.devices.id.through(r.deviceGames.deviceId),
            to: r.availableGames.id.through(r.deviceGames.gameId)
        })
    },

    availableGames: {
        supportedDevices: r.many.devices({
            from: r.availableGames.id.through(r.deviceGames.gameId),
            to: r.availableGames.id.through(r.deviceGames.deviceId)
        })
    }
}))