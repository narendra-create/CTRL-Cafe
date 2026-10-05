import { db } from "@/src/index";
import { createClient } from "@/lib/supabase/serverClient";
import { profiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function isLoggedIn(): Promise<boolean> {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
    if (error) {
        throw new Error(error.message);
    }
    if (!user) {
        return false;
    }

    return true;
};

export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
    if (error) {
        throw new Error(error.message);
    };
    if (!user) {
        throw new Error("Please Log in first")
    };
    const [account] = await db.select({ accountType: profiles.accountType }).from(profiles).where(eq(profiles.id, user.claims.sub));

    if (account.accountType === "admin") {
        return true;
    };
    return false;
}