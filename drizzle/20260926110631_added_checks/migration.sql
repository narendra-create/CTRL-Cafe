ALTER TABLE "bookings" ADD CONSTRAINT "booking_time_valid" CHECK ("start_time" < "end_time");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "booking_price_valid" CHECK ("total_amount" >= 0);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "booking_playercount_valid" CHECK ("players_count" >= 0);--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "device_price_valid" CHECK ("hourly_rate" >= 0);--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "device_players_valid" CHECK ("max_players" >= 0);--> statement-breakpoint
ALTER TABLE "food_items" ADD CONSTRAINT "food_item_price_valid" CHECK ("price" >= 0);--> statement-breakpoint
ALTER TABLE "food_items" ADD CONSTRAINT "food_item_serving_valid" CHECK ("serves" >= 1);--> statement-breakpoint
ALTER TABLE "time_slots" ADD CONSTRAINT "time_valid" CHECK ("start_time" < "end_time");--> statement-breakpoint

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_no_device_overlap"
EXCLUDE USING gist (
    "booked_device" WITH =,
    tstzrange("start_time", "end_time") WITH &&
)
WHERE (
    "booking_status" IN ('pending', 'confirmed')
);