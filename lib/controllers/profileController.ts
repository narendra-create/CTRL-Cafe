"use server";
import { checkAccountType } from "@/lib/actions/authorizationCheck";
import { createClient } from "@/lib/supabase/serverClient";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { UpdateProfileInput, updateProfileSchema } from "@/lib/validations/profileValidation";
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

export const getProfileDetails = async (): Promise<{
    success: boolean;
    message?: string;
    data?: typeof profiles.$inferSelect;
    email?: string;
    providers?: string[];
}> => {
    try {
        const supabase = await createClient();
        const user = await supabase.auth.getClaims();
        if (!user.data) {
            return {
                success: false,
                message: "Unauthenticated"
            }
        };

        const [userdetails] = await db.select().from(profiles).where(eq(profiles.id, user.data.claims.sub)).limit(1);

        if (!userdetails) {
            return {
                success: false,
                message: "User Not Found"
            }
        };

        return {
            success: true,
            data: userdetails,
            email: user.data.claims.email,
            providers: user.data.claims.app_metadata?.providers
        }
    }
    catch (err) {
        console.error("[getProfileDetails]: ", err);
        return {
            success: false,
            message: "Something Went wrong while fetching profile"
        }
    }
};

export const updateProfile = async (input: UpdateProfileInput): Promise<{
    success: boolean;
    message?: string;
    data?: typeof profiles.$inferSelect
}> => {
    try {
        const { userId, success: authSuccess, message: authError } = await checkAccountType();
        if (!authSuccess) {
            return {
                success: false,
                message: authError
            }
        };
        const { error: zodError, data, success: zodsuccess } = updateProfileSchema.safeParse(input);
        if (!zodsuccess) {
            return {
                success: false,
                message: zodError.message
            }
        };

        const [updatedProfile] = await db.update(profiles).set({
            avatarUrl: data.avatarUrl,
            dateOfBirth: data.dateOfBirth,
            fullName: data.fullName,
            phone: data.phone,
            gender: data.gender,
        }).where(eq(profiles.id, userId!)).returning();

        return {
            success: true,
            data: updatedProfile
        }
    }
    catch (err) {
        console.error("[updateProfile]: ", err);
        return {
            success: false,
            message: "Something Went Wrong"
        }
    }
};

export const deleteProfile = async (): Promise<{
    success: boolean;
    message?: string;
}> => {
    try {
        const supabase = await createClient();
        const claims = await supabase.auth.getClaims();
        if (!claims.data) {
            return {
                success: false,
                message: "Please Log in first"
            }
        };
        const [findUserInDB] = await db.select({ deletedAt: profiles.deletedAt, id: profiles.id }).from(profiles).where(eq(profiles.id, claims.data.claims.sub));
        if (!findUserInDB) {
            return {
                success: false,
                message: "User Not Found"
            }
        };
        if (findUserInDB.deletedAt) {
            return {
                success: false,
                message: "Already Deleted"
            }
        };

        const now = new Date();

        await db.update(profiles).set({
            fullName: "Deleted User",
            phone: null,
            avatarUrl: null,
            dateOfBirth: null,
            gender: null,
            rewardPoints: 0,
            deletedAt: now
        }).where(eq(profiles.id, findUserInDB.id));

        return {
            success: true
        }
    }
    catch (err) {
        console.error("[deleteProfile]: ", err);
        return {
            success: false,
            message: "Something Went Wrong"
        }
    }
};