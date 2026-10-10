import {
    pgEnum,
    pgTable,
    text,
    integer,
    timestamp,
    uuid,
    numeric,
    boolean,
    date,
    pgPolicy,
    index,
    check,
    time,
    primaryKey
} from "drizzle-orm/pg-core";
import { authUsers, authUid, authenticatedRole } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const genderEnum = pgEnum("gender", [
    "male",
    "female",
    "other",
]);

export const foodCategoryEnum = pgEnum("food_category", [
    "food",
    "beverage",
    "snacks",
    "dessert",
]);

export const deviceTypeEnum = pgEnum("device_type", [
    "console",
    "pc",
    "arcade",
    "vr"
]);

export const accountTypeEnum = pgEnum("account_type", [
    "admin",
    "user"
]);

export const bookingStatusEnum = pgEnum("booking_status", [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
]);

export const profiles = pgTable("profiles", {
    /* Same UUID as Supabase auth.users.id */
    id: uuid("id")
        .primaryKey()
        .notNull()
        .references(() => authUsers.id, {
            onDelete: "cascade",
        }),

    /* Profile information*/
    fullName: text("full_name"),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    accountType: accountTypeEnum("account_type").notNull().default("user"),
    rewardPoints: integer("reward_points").notNull().default(0),

    /*Timestamps*/
    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    pgPolicy("users_can_select_their_profile", {
        for: "select",
        to: authenticatedRole,
        using: sql`${authUid} = ${table.id}`
    }),
    pgPolicy("users_can_update_their_profile", {
        for: "update",
        to: authenticatedRole,
        using: sql`${authUid} = ${table.id}`,
        withCheck: sql`${authUid} = ${table.id}`
    }),
    pgPolicy("users_insert_own_profile", {
        for: "insert",
        to: authenticatedRole,
        withCheck: sql`${authUid} = ${table.id}`
    }),

    // --- indexes ---
]);

export const foodItems = pgTable("food_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    price: numeric("price", {
        precision: 10,
        scale: 2
    }).notNull(),
    serves: integer("serves").notNull().default(1),
    isAvailable: boolean("is_available").default(true).notNull(),
    imageUrl: text("image_url"),
    category: foodCategoryEnum("category").notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
},
    (table) => [
        pgPolicy("all_users_can_see", {
            for: "select",
            to: authenticatedRole,
            using: sql`true`
        }),
        pgPolicy("only_admins_can_add", {
            for: "insert",
            to: authenticatedRole,
            withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("only_admins_can_delete", {
            for: "delete",
            to: authenticatedRole,
            using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),

        //Indexes
        index("fooditems_availability_idx").on(table.isAvailable),

        //Checks
        check("food_item_price_valid", sql`${table.price} >= 0`),
        check("food_item_serving_valid", sql`${table.serves} >= 1`)
    ]
);

export const devices = pgTable("devices", {
    id: uuid("id").defaultRandom().primaryKey(),
    deviceName: text("device_name").notNull().unique(),
    units: integer("units").notNull().default(1),
    type: deviceTypeEnum("type").notNull(),
    maxPlayers: integer("max_players").notNull(),
    hourlyRate: numeric("hourly_rate", {
        precision: 8,
        scale: 2
    }).notNull(),
    extraConsolePrice: numeric("extra_console_price", {
        precision: 5,
        scale: 2
    }),
}, (table) => [
    pgPolicy("all_users_can_see_devices", {
        for: "select",
        to: authenticatedRole,
        using: sql`true` // means no rls for select
    }),
    pgPolicy("only_admins_can_insert", {
        for: "insert",
        to: authenticatedRole,
        withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),
    pgPolicy("only_admins_can_delete", {
        for: "delete",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),
    pgPolicy("only_admins_can_update", {
        for: "update",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`,
        withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),

    //Indexes
    index("device_type_index").on(table.type),

    //Checks
    check("device_price_valid", sql`${table.hourlyRate} >= 0`),
    check("device_players_valid", sql`${table.maxPlayers} >= 0`)
]);

export const timeSlots = pgTable("time_slots", {
    id: uuid("id").defaultRandom().primaryKey(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    timeZone: text("time_zone").notNull(),
    availableDevices: deviceTypeEnum("available_devices").array().notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    pgPolicy("anyone_can_see", {
        for: "select",
        to: authenticatedRole,
        using: sql`true`
    }),
    pgPolicy("only_admins_can_add", {
        for: "insert",
        to: authenticatedRole,
        withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),
    pgPolicy("only_admins_can_update", {
        for: "update",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`,
        withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),
    pgPolicy("only_admins_can_delete", {
        for: "delete",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),

    //Indexes
    index("time_start_idx").on(table.startTime),
    index("time_end_idx").on(table.endTime),

    //Checks
    check("time_valid", sql`${table.startTime} < ${table.endTime}`)
]);

export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").notNull().references(() => profiles.id),
    totalAmount: numeric("total_amount", {
        precision: 10,
        scale: 2
    }).notNull(),
    startTime: timestamp("start_time", {
        withTimezone: true
    }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    bookedDevice: uuid("booked_device").notNull().references(() => devices.id),
    playersCount: integer("players_count").notNull().default(1),
    bookingStatus: bookingStatusEnum("booking_status").notNull().default("pending"),
    isArchived: boolean("is_archived").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
},
    (table) => [
        pgPolicy("users_can_book_for_their_own", {
            for: "insert",
            to: authenticatedRole,
            withCheck: sql`${authUid} = ${table.userId}`
        }),
        pgPolicy("users_can_see_their_bookings", {
            for: "select",
            to: authenticatedRole,
            using: sql`${authUid} = ${table.userId}`
        }),
        pgPolicy("users_can_update_their_bookings", {
            for: "update",
            to: authenticatedRole,
            using: sql`${authUid} = ${table.userId} AND ${table.bookingStatus} = 'pending'`,
            withCheck: sql`${authUid} = ${table.userId}`
        }),
        pgPolicy("admins_can_see_all_bookings", {
            for: "select",
            to: authenticatedRole,
            using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid} 
            AND account_type = 'admin'
        )`}),
        pgPolicy("admins_can_edit_all_bookings", {
            for: "update",
            to: authenticatedRole,
            using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`,
            withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),

        //Indexes
        index("booking_device_idx").on(table.bookedDevice),
        index("booking_user_status_idx").on(table.userId, table.bookingStatus),
        index("booking_start_idx").on(table.startTime),

        //Checks
        check("booking_time_valid", sql`${table.startTime} < ${table.endTime}`),
        check("booking_price_valid", sql`${table.totalAmount} >= 0`),
        check("booking_playercount_valid", sql`${table.playersCount} >= 0`)
    ]
);

export const availableGames = pgTable("available_games", {
    id: uuid("id").defaultRandom().primaryKey(),
    gameName: text("game_name").notNull().unique(),
    gameGenre: text("game_genre"),
    imageUrl: text("image_url").notNull(),
    releaseYear: integer("release_year"),
    description: text("description")
});

export const deviceGames = pgTable("device_games", {
    deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    gameId: uuid("game_id").notNull().references(() => availableGames.id, { onDelete: "cascade" })
},
    (table) => [
        primaryKey({
            columns: [table.deviceId, table.gameId]
        }),
        index("device_games_game_id_idx").on(table.gameId),
        index("device_games_device_id_idx").on(table.deviceId)
    ]
);