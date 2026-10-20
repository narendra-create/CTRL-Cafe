CREATE TABLE "booking_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"booking_id" uuid NOT NULL,
	"food_item_id" uuid NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10,2) NOT NULL,
	CONSTRAINT "negetive_price_check" CHECK ("unit_price" >= 0)
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "razorpay_order_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "razorpay_payment_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "paid_amount" numeric(10,2);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "hold_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_razorpay_payment_id_key" UNIQUE("razorpay_payment_id");--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id");--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_food_item_id_food_items_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id");