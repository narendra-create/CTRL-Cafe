import {
    pgEnum,
    pgTable,
    text,
    integer,
    timestamp,
    uuid,
    numeric,
    boolean,
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

export const deviceTypeEnum = pgEnum("deviceType", [
    "console",
    "pc",
    "arcade",
    "vr"
])

export const profiles = pgTable("profiles", {
    /* Same UUID as Supabase auth.users.id */
    id: uuid("id")
        .primaryKey()
        .notNull()
        .references(() => authUsers.id, {
            onDelete: "cascade",
        }),

    /* Profile information*/
    fullname: text("full_name"),
    phone: text("phone"),
    avatarurl: text("avatar_url"),
    age: integer("age").notNull(),
    gender: genderEnum("gender"),

    /*Timestamps*/
    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const fooditems = pgTable("food_items", {
    id: uuid().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    price: numeric("price", {
        precision: 10,
        scale: 2
    }),
    serves: integer("serves"),
    isavailable: boolean("is_available").default(true).notNull(),
    imageurl: text("image_url"),
    category: foodCategoryEnum("category").notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const devices = pgTable("devices", {
    id: uuid().defaultRandom().notNull(),
    devicename: text("device_name").notNull(),
    type: deviceTypeEnum("type").notNull(),
    maxplayers: integer("max_players").notNull(),
    hourlyrate: numeric("hourly_rate", {
        precision: 8,
        scale: 2
    }).notNull(),
    extraconsoleprice: numeric("extra_console_price", {
        precision: 5,
        scale: 2
    }),
});