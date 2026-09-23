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
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

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
});

export const foodItems = pgTable("food_items", {
    id: uuid().defaultRandom().primaryKey(),
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
});

export const devices = pgTable("devices", {
    id: uuid().defaultRandom().primaryKey(),
    deviceName: text("device_name").notNull().unique(),
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
});

export const timeSlots = pgTable("time_slots", {
    id: uuid().defaultRandom().primaryKey(),
    startTime: timestamp("start_time", {
        withTimezone: true
    }).notNull(),
    endTime: timestamp("end_time", {
        withTimezone: true
    }),
    availableDevices: deviceTypeEnum("available_devices").array().notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().notNull().references(() => profiles.id),
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

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
})