import { deviceTypeEnum } from "@/src/db/schema";
import z from "zod";

export const addSlotSchema = z.object({
    endTime: z.iso.time({ precision: -1 }),
    startTime: z.iso.time({ precision: -1 }),
    availableDevices: z.enum(deviceTypeEnum.enumValues).array(),
    timeZone: z.string().min(1)
});

export type addSlotInput = z.infer<typeof addSlotSchema>;