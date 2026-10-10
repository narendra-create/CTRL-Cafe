import { db } from "@/src/index";
import { profiles } from "@/src/db/schema";

export const addPoints = async (userId: string): Promise<{
    success: boolean;
    message?: string;
    currentPoints?: string;
}> => {
    try {
        const userProfile = await db.update(profiles).set({
            rewardPoints: 
        })
    }
    catch (err) {
        console.error("[addPoints server action]: ", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
}