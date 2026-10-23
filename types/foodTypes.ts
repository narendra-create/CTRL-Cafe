import type { FoodCardProps } from "@/app/custom-components/cards/FoodCard";
import { foodItems } from "@/src/db/schema";

export type { FoodCardProps };

export type FoodItemSelect = typeof foodItems.$inferSelect;
export type FoodItemInsert = typeof foodItems.$inferInsert;
