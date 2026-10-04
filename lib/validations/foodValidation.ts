import z from "zod";
import { foodCategoryEnum } from "@/src/db/schema";

export const addFoodInput = z.object({
    name: z.string().min(2, "Min 2 charectors required in name").max(100),
    description: z.string().max(110).nullable(),
    price: z.number().nonnegative(),
    serves: z.number().nullable(),
    imageUrl: z.string().nullable(),
    category: foodCategoryEnum
});

export type addFoodType = z.infer<typeof addFoodInput>;