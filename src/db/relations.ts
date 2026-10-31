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

        game_stations: r.many.gameStations({
            from: r.devices.id,
            to: r.gameStations.deviceId
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
        // One booking has many booked stations
        stations: r.many.bookingStations({
            from: r.bookings.id,
            to: r.bookingStations.bookingId
        }),
        items: r.many.bookingItems({
            from: r.bookings.id,
            to: r.bookingItems.bookingId
        })
    },

    bookingItems: {
        booking: r.one.bookings({
            from: r.bookingItems.bookingId,
            to: r.bookings.id,
            optional: false
        }),
        foodItem: r.one.foodItems({
            from: r.bookingItems.foodItemId,
            to: r.foodItems.id,
            optional: false
        })
    },

    foodItems: {
        bookingItems: r.many.bookingItems({
            from: r.foodItems.id,
            to: r.bookingItems.foodItemId
        })
    },

    gameStations: {
        device: r.one.devices({
            from: r.gameStations.deviceId,
            to: r.devices.id
        }),
        booked_stations: r.many.bookingStations({
            from: r.gameStations.id,
            to: r.bookingStations.gameStationId
        })
    },

    bookingStations: {
        booking: r.one.bookings({
            from: r.bookingStations.bookingId,
            to: r.bookings.id,
            optional: false
        }),
        station: r.one.gameStations({
            from: r.bookingStations.gameStationId,
            to: r.gameStations.id,
            optional: false
        })
    }
}))