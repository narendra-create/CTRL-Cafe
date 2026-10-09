import { accountTypeEnum } from "@/src/db/schema";

export type AccountType = typeof accountTypeEnum.enumValues[number];
// → "admin" | "user"