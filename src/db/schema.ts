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
    primaryKey,
    unique
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
    "hold",
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

    // --- Checks ---
    check("negetive_rewardpoint_check", sql`${table.rewardPoints} >= 0`)
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

export const gameStations = pgTable("game_stations", {
    id: uuid("id").defaultRandom().primaryKey(),
    stationLabel: text("station_label").notNull(),
    frontendLabel: text("frontend_label").notNull(),
    isActive: boolean("is_active").notNull().default(true), //For maintanance toggle
    deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
}, (table) => [
    unique("station_label_unique").on(table.deviceId, table.stationLabel),
    index("deviceid_index").on(table.deviceId),

    //RLS policies
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
]);

export const devices = pgTable("devices", {
    id: uuid("id").defaultRandom().primaryKey(),
    deviceName: text("device_name").notNull().unique(),
    supportsFiltering: boolean("supports_filtering"),
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
    playersCount: integer("players_count").notNull().default(1),
    bookingStatus: bookingStatusEnum("booking_status").notNull().default("pending"),
    isArchived: boolean("is_archived").notNull().default(false),
    rewardGranted: boolean("reward_granted").notNull().default(false), //changing the name from reward redeemed to reward granted to end the confusion

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

    //Razorpay fields
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id").unique(),  // unique = built-in idempotency
    paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }),

    //Hold expire time
    holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true })
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
            using: sql`${authUid} = ${table.userId} AND ${table.bookingStatus} IN ('pending', 'hold')`,
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
        index("booking_user_status_idx").on(table.userId, table.bookingStatus),
        index("booking_start_idx").on(table.startTime),

        //Checks
        check("booking_time_valid", sql`${table.startTime} < ${table.endTime}`),
        check("booking_price_valid", sql`${table.totalAmount} >= 0`),
        check("booking_playercount_valid", sql`${table.playersCount} >= 1`)
    ]
);

export const availableGames = pgTable("available_games", {
    id: uuid("id").defaultRandom().primaryKey(),
    gameName: text("game_name").notNull().unique(),
    gameGenre: text("game_genre"),
    imageUrl: text("image_url").notNull(),
    releaseYear: integer("release_year"),
},
    (table) => [
        pgPolicy("only_admin_can_add_games", {
            for: "insert",
            to: authenticatedRole,
            withCheck: sql`  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("only_admins_can_update_games", {
            for: "update",
            to: authenticatedRole,
            using: sql`EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`,
            withCheck: sql`  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("only_admins_can_delete", {
            for: "delete",
            to: authenticatedRole,
            using: sql`  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("anyone_can_see", {
            for: "select",
            to: authenticatedRole,
            using: sql`true`
        }),


        index("game_genre_idx").on(table.gameGenre),
        index("game_name_idx").on(table.gameName)
    ]);

//Junction Tables
export const deviceGames = pgTable("device_games", {
    deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    gameId: uuid("game_id").notNull().references(() => availableGames.id, { onDelete: "cascade" })
},
    (table) => [
        pgPolicy("admins_can_insert", {
            for: "insert",
            to: authenticatedRole,
            withCheck: sql`EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("admins_can_delete", {
            for: "delete",
            to: authenticatedRole,
            using: sql`EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
        }),
        pgPolicy("anyone_can_view_this_junction", {
            for: "select",
            to: authenticatedRole,
            using: sql`true`
        }),

        primaryKey({
            columns: [table.deviceId, table.gameId]
        }),
        index("device_games_game_id_idx").on(table.gameId),
        index("device_games_device_id_idx").on(table.deviceId)
    ]
);

export const bookingStations = pgTable("booking_stations", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    gameStationId: uuid("game_station_id").notNull().references(() => gameStations.id),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    playersCount: integer("players_count").notNull().default(1),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
}, (table) => [
    //RLS Policies
    pgPolicy("users_can_see_their_booked_stations", {
        for: "select",
        to: authenticatedRole,
        using: sql`
       EXISTS (
        SELECT 1 from bookings
        WHERE bookings.id = ${table.bookingId}
        AND bookings."userId" = ${authUid}
       )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )`
    }),
    pgPolicy("users_can_insert_booking_stations", {
        for: 'insert',
        to: authenticatedRole,
        withCheck: sql`
      EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.id = ${table.bookingId}
        AND bookings."userId" = ${authUid}        
      )
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = ${authUid}
        AND account_type = 'admin'
      )
      `
    }),
    pgPolicy("admins_can_update_booked_stations", {
        for: "update",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )
        `,
        withCheck: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )
        `
    }),
    pgPolicy("admins_can_delete_bookingstations", {
        for: "delete",
        to: authenticatedRole,
        using: sql`
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = ${authUid}
            AND account_type = 'admin'
        )
        `
    }),

    //Indexes
    index("bookingid_idx").on(table.bookingId),
    index("stationid_idx").on(table.gameStationId),

    //Uniqueness
    unique("one_station_per_booking_unique").on(table.bookingId, table.gameStationId),

    //Checks
    check("bookingstation_time_valid", sql`${table.startTime} < ${table.endTime}`),
    check("bookingstation_playercount_valid", sql`${table.playersCount} >= 1`)
]);

export const bookingItems = pgTable("booking_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id),
    foodItemId: uuid("food_item_id").notNull().references(() => foodItems.id),
    qty: integer("qty").notNull().default(1),
    unitPrice: numeric("unit_price", {
        precision: 10,
        scale: 2
    }).notNull()
}, (table) => [
    check("negetive_price_check", sql`${table.unitPrice} >= 0`)
]);