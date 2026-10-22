import z from "zod";

export const seatHoldSchema = z.object({
    endTime: z.iso.datetime({ offset: true }),
    startTime: z.iso.datetime({ offset: true }),
    bookedDevice: z.uuid(),
    playersCount: z.number().int().nonnegative().min(1).default(1),
});

const bookingFooditemsSchema = z.array(z.object({
    foodItemId: z.uuid(),
    qty: z.int().min(1).default(1)
})
);

export const bookSeatSchema = z.object({
    bookingId: z.uuid(),
    foodItems: bookingFooditemsSchema.default([])
});

export const verifyPaymentSchema = z.object({
    razorpay_payment_id: z.string(),
    razorpay_order_id: z.string(),
    razorpay_signature: z.string(),
    bookingId: z.uuid()
});

export const getBookingDetailsSchema = z.object({
    bookingId: z.uuid()
});

export type SeatHoldeInput = z.infer<typeof seatHoldSchema>;
export type BookSeatInput = z.infer<typeof bookSeatSchema>;
export type VerifySignatureInput = z.infer<typeof verifyPaymentSchema>;
export type getBookingDetailsInput = z.infer<typeof getBookingDetailsSchema>;