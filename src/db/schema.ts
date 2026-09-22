import { pgSchema, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"

const authSchema = pgSchema("auth")
const authUsers = authSchema.table("users", {
    id: uuid("id").primaryKey(),
})

export const profiles = pgTable("profiles", {
    id: uuid("id")
        .primaryKey()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    fullName: text("full_name"),
    createdAt: timestamp("created_at").defaultNow(),
})