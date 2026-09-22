import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!, {
    prepare: false, // required once you switch to Supabase's pooler in "Transaction" mode
})
export const db = drizzle({ client })