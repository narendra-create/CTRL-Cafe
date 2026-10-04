"use server";
import { db } from "@/src/index";
import { createClient } from "@/lib/supabase/serverClient";
import type { addFoodType } from "@/lib/validations/foodValidation";

export const addItem = async (input: addFoodType) => {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getClaims();
}