import { deviceTypeEnum } from "@/src/db/schema";
import z from "zod";

export const deviceAddSchema = z.object({
    deviceName: z.string(),
    type: z.enum(deviceTypeEnum.enumValues),
    maxPlayers: z.number().nonnegative().min(1, "Minimum 1 player needed"),
    hourlyRate: z.number().nonnegative(),
    extraConsolePrice: z.number().nonnegative().optional()
});

export const updateDeviceSchema = z.object({
    id: z.string(),
    deviceName: z.string().optional(),
    type: z.enum(deviceTypeEnum.enumValues).optional(),
    maxPlayers: z.number().nonnegative().min(1, "Minimum 1 player needed").optional(),
    hourlyRate: z.number().nonnegative().optional(),
    extraConsolePrice: z.number().nonnegative().optional()
});

export type deviceAddInput = z.infer<typeof deviceAddSchema>;
export type updateDeviceInput = z.infer<typeof updateDeviceSchema>;