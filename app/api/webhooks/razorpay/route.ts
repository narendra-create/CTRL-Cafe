import { NextResponse } from "next/server";
import { paiseToRupees } from "@/lib/utils/tools";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { db } from "@/src/index";
import { bookings } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { addPoints } from "@/lib/actions/rewardActions";

export async function POST(req: Request) {
    try {
        //Read the raw text body (Razorpay signs the RAW body string!)
        const rawbody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");
        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webHookSecret) {
            console.error("Missing RAZORPAY_WEBHOOK_SECRET in environment");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        };

        // Cryptographically verify the webhook signature
        const isValid = validateWebhookSignature(rawbody, signature, webHookSecret);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
        };
        // Parse the verified payload
        const event = await JSON.parse(rawbody);
        // Handle Successful Payment Events
        if (event.event === "order.paid" || event.event === "order.captured") {
            const paymentEntity = event.payload.payment.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const razorpayPaymentId = paymentEntity.id;
            const paidAmountInRupees = paiseToRupees(paymentEntity.amount);
            // Fetch booking by razorpayOrderId
            const [dbbooking] = await db.select().from(bookings).where(eq(bookings.razorpayOrderId, razorpayOrderId));
            if (!dbbooking) {
                console.warn(`[Webhook] No booking found for order: ${razorpayOrderId}`);
                // returning 200 so Razorpay stops retrying
                return NextResponse.json({ status: "ignored" }, { status: 200 });
            };

            // IDEMPOTENCY: If client-side verifyPayment already confirmed it, skip!
            if (dbbooking.bookingStatus === "confirmed") {
                return NextResponse.json({ status: "already_confirmed" }, { status: 200 });
            };
            // Update booking to confirmed
            await db.update(bookings).set({
                bookingStatus: "confirmed",
                razorpayPaymentId: razorpayPaymentId,
                paidAmount: paidAmountInRupees
            }).where(and(
                eq(bookings.id, dbbooking.id),
                eq(bookings.bookingStatus, "pending")
            ));
            // calling addPoints here
            await addPoints(dbbooking.userId, dbbooking.id);
        }
        // Handle Payment Failure
        if (event.event === "payment.failed") {
            const paymentEntity = event.payload.payment.entity;
            console.warn(`[Webhook] Payment failed for order: ${paymentEntity.order_id}`);
            console.log("[Webhook]: Payment Failed");
        };
        return NextResponse.json({ status: "ok" }, { status: 200 });
    }
    catch (err) {
        console.error("[Razorpay Webhook Error]: ", err);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}