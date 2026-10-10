import * as schema from "@/src/db/schema";
import { defineRelations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

export const relations = defineRelations({ ...schema, authUsers }, (r) => ({
    //Many devices support one game and many games will have many supporting devices - many to many - junction table
    devices: {
        supportedGames: r.many.availableGames({
            from: r.devices.id.through(r.deviceGames.deviceId),
            to: r.availableGames.id.through(r.deviceGames.gameId)
        }),

        bookings: r.many.bookings({
            from: r.devices.id,
            to: r.bookings.bookedDevice
        })
    },

    availableGames: {
        supportedDevices: r.many.devices({
            from: r.availableGames.id.through(r.deviceGames.gameId),
            to: r.devices.id.through(r.deviceGames.deviceId)
        })
    },
    //One profile for each booking but many bookings for a profile - one to many
    profiles: {
        bookings: r.many.bookings({
            from: r.profiles.id,
            to: r.bookings.userId
        }),

        //MOST IMPORTENT RELATION
        //One supabase authUser for one profile - one to one
        authUser: r.one.authUsers({
            from: r.profiles.id,
            to: r.authUsers.id,
            optional: false
        })
    },

    authUsers: {
        profile: r.one.profiles({
            from: r.authUsers.id,
            to: r.profiles.id
        })
    },
    bookings: {
        profile: r.one.profiles({
            from: r.bookings.userId,
            to: r.profiles.id,
            optional: false
        }),
        //One device for one booking but many bookings of one device - one to many
        device: r.one.devices({
            from: r.bookings.bookedDevice,
            to: r.devices.id,
            optional: false
        })
    },
}))