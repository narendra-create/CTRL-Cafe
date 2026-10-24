"use server";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { profiles } from "@/src/db/schema";
import { db } from "@/src/index";
import { eq } from "drizzle-orm";

export const getCurrentPoints = async (): Promise<number | null> => {
    try {
        const { dbuser, error: authError } = await resolveAuthenticatedUser("user");
        if (authError) return null;

        const [user] = await db.select({ points: profiles.rewardPoints }).from(profiles).where(eq(profiles.id, dbuser.userId));

        return Number(user.points);
    }
    catch (err) {
        console.error("[getCurrentPoints]: ", err);
        return null;
    }
};