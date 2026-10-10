"use server";
import { createClient } from "@/lib/supabase/serverClient";
import { profiles } from "@/src/db/schema";
import { db } from "@/src/index";
import { eq } from "drizzle-orm";
import { AccountType } from "@/types/helperTypes";

export const resolveAuthenticatedUser = async (allowedRole: AccountType) => {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();

    if (error) return { error: { success: false, message: error.message } };
    if (!user) return { error: { success: false, message: "Please log in first" } };

    const [dbuser] = await db
        .select({ userId: profiles.id, accountType: profiles.accountType })
        .from(profiles)
        .where(eq(profiles.id, user.claims.sub));

    if (!dbuser) return { error: { success: false, message: "User account not found" } };
    if (dbuser.accountType !== allowedRole) return { error: { success: false, message: `This is a ${allowedRole.toLowerCase()}-only operation` } };

    return { dbuser };
};