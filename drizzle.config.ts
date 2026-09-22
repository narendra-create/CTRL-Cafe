import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url: process.env.DATABASE_URL! },
    schemaFilter: ["public"], // don't let drizzle touch Supabase's own schemas
})