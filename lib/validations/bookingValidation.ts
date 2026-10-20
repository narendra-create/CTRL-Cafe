import z from "zod";

export const seatHoldSchema = z.object({
    endTime: z.iso.datetime({ offset: true }),
    startTime: z.iso.datetime({ offset: true }),
    bookedDevice: z.uuid(),
    playersCount: z.number().int().nonnegative().min(1).default(1),
});

export type SeatHoldeInput = z.infer<typeof seatHoldSchema>;