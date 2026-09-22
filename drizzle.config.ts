import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url: process.env.DATABASE_URL! },
    schemaFilter: ["public"], // don't let drizzle touch Supabase's own schemas
    verbose: true,
    strict: true,
})