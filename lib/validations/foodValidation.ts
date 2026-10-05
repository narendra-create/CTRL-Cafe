import z from "zod";
import { foodCategoryEnum } from "@/src/db/schema";

export const addFoodInput = z.object({
    name: z.string().min(2, "Min 2 charectors required in name").max(100),
    description: z.string().max(110).nullable(),
    price: z.number().nonnegative(),
    serves: z.number().optional(),
    imageUrl: z.string().nullable(),
    category: z.enum(foodCategoryEnum.enumValues)
});

export type addFoodType = z.infer<typeof addFoodInput>;