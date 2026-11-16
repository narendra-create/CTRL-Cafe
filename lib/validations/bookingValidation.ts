import z from "zod";

export const seatHoldSchema = z.object({
    endTime: z.iso.datetime({ offset: true }),
    startTime: z.iso.datetime({ offset: true }),
    gameStations: z.array(z.object({
        stationId: z.uuid(),
        playersCount: z.number().nonnegative()
    })).nonempty(),
    playersCount: z.number().int().nonnegative().min(1).default(1),
});

const bookingFooditemsSchema = z.array(z.object({
    foodItemId: z.uuid(),
    qty: z.int().min(1).default(1)
})
);

export const bookSeatSchema = z.object({
    bookingId: z.uuid(),
    foodItems: bookingFooditemsSchema.default([]),
    redeemCode: z.string().trim().optional()
});

export const offlineBookingSchema = seatHoldSchema.extend({
    guestName: z.string().min(1, "Guest name is required"),
    guestPhone: z.string().min(10, "Valid phone number required"),
    paymentMethod: z.enum(["cash", "counter_upi", "coupon_code"]),
    redeemCode: z.string().trim().optional()
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
export type offlineBookingInput = z.infer<typeof offlineBookingSchema>;