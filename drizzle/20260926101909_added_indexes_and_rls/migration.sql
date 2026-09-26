CREATE INDEX "booking_device_idx" ON "bookings" ("booked_device");--> statement-breakpoint
CREATE INDEX "booking_user_status_idx" ON "bookings" ("userId","booking_status");--> statement-breakpoint
CREATE INDEX "booking_start_idx" ON "bookings" ("start_time");--> statement-breakpoint
CREATE INDEX "device_type_index" ON "devices" ("type");--> statement-breakpoint
CREATE INDEX "fooditems_availability_idx" ON "food_items" ("is_available");--> statement-breakpoint
CREATE INDEX "time_start_idx" ON "time_slots" ("start_time");--> statement-breakpoint
CREATE INDEX "time_end_idx" ON "time_slots" ("end_time");