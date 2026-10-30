CREATE TABLE "game_stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"station_label" text NOT NULL,
	"frontend_label" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"device_id" uuid NOT NULL,
	CONSTRAINT "station_label_unique" UNIQUE("device_id","station_label")
);
--> statement-breakpoint
ALTER TABLE "game_stations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_booked_device_devices_id_fkey";--> statement-breakpoint
DROP INDEX "booking_device_idx";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "game_station_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_no_device_overlap";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "booked_device";--> statement-breakpoint
ALTER TABLE "devices" DROP COLUMN "units";--> statement-breakpoint
ALTER TABLE "devices" DROP COLUMN "available_units";--> statement-breakpoint
CREATE INDEX "gamestation_id_idx" ON "bookings" ("game_station_id");--> statement-breakpoint
CREATE INDEX "deviceid_index" ON "game_stations" ("device_id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_game_station_id_game_stations_id_fkey" FOREIGN KEY ("game_station_id") REFERENCES "game_stations"("id");--> statement-breakpoint
ALTER TABLE "game_stations" ADD CONSTRAINT "game_stations_device_id_devices_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "all_users_can_see_devices" ON "game_stations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "only_admins_can_insert" ON "game_stations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_delete" ON "game_stations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_update" ON "game_stations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )) WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
ALTER POLICY "users_can_update_their_bookings" ON "bookings" TO "authenticated" USING ((select auth.uid()) = "bookings"."userId" AND "bookings"."booking_status" IN ('pending', 'hold')) WITH CHECK ((select auth.uid()) = "bookings"."userId");

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_no_station_overlap"
EXCLUDE USING gist (
    "game_station_id" WITH =,
    tstzrange("start_time", "end_time", '[)') WITH &&
)
WHERE (
    "booking_status" IN ('hold', 'pending', 'confirmed')
);--> statement-breakpoint