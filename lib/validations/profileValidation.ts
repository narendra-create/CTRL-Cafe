import { profiles } from "@/src/db/schema";
import z from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string(),
    phone: z.string(),
    avatarUrl: z.string(),
    dateOfBirth: z.string(),
    gender: z.enum(profiles.gender.enumValues)
}).partial()

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;