"use server";
import { db } from "@/src/index";
import type { addFoodType } from "@/lib/validations/foodValidation";
import { checkAccountType, isLoggedIn } from "@/lib/actions/authorizationCheck";
import { foodItems } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const addItem = async (input: addFoodType): Promise<{
    success: boolean;
    message?: string;
}> => {
    const userLoggedIn = await isLoggedIn();
    if (!userLoggedIn) {
        return { success: false, message: "User Not Logged In" }
    };

    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return { success: false, message: "Forbidden" }
    }

    try {
        await db.insert(foodItems).values({
            name: input.name,
            category: input.category,
            price: String(input.price),
            description: input.description,
            imageUrl: input.imageUrl,
            serves: input.serves
        });

        return { success: true }
    }
    catch (err: any) {
        console.error("[addItem]:", err);

        // Postgres unique violation error code
        if (err?.code === "23505") {
            return { success: false, message: "A food item with this name already exists" }
        }

        return { success: false, message: "Server Error" }
    }
};

export const getFoodItems = async () => {
    try {
        const foods = await db.select().from(foodItems).where(eq(foodItems.isAvailable, true));
        return foods;
    }
    catch (err) {
        console.error("[getFoodItems]:", err);
        return [];
    }
};

export const deleteFoodItems = async (id: string): Promise<{
    success: boolean;
    message?: string;
}> => {
    const user = await isLoggedIn();
    if (!user) {
        return { success: false, message: "Unauthorized" }
    };

    //Checking if user is admin
    const { isAdmin } = await checkAccountType();
    if (!isAdmin) {
        return { success: false, message: "Forbidden" }
    };

    try {
        await db.delete(foodItems).where(eq(foodItems.id, id));
        return {
            success: true
        }
    }

    catch (err) {
        console.error("[deleteFoodItems]:", err);
        return {
            success: false,
            message: "Server Error"
        }
    }
};