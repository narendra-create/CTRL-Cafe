"use server";
import { db } from "@/src/index";
import { createClient } from "@/lib/supabase/serverClient";
import { profiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

//remove this next
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

export async function checkAccountType(): Promise<{
    userId?: string | null;
    isAdmin?: boolean;
    success: boolean;
    message?: string;
}> {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
    if (error) {
        return {
            success: false,
            message: error.message
        }
    };
    if (!user) {
        return {
            message: "Please Log in first",
            success: false
        }
    };
    const [account] = await db.select({ accountType: profiles.accountType, userId: profiles.id }).from(profiles).where(eq(profiles.id, user.claims.sub));
    if (!account) {
        return {
            success: false,
            message: "User Not Found"
        }
    }
    if (account.accountType === "admin") {
        return {
            isAdmin: true,
            userId: account.userId,
            success: true
        };
    };
    return {
        isAdmin: false,
        userId: null,
        success: true
    };
}