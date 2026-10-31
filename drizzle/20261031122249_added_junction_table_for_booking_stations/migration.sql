CREATE TABLE "booking_stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"game_station_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"players_count" integer DEFAULT 1 NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	CONSTRAINT "one_station_per_booking_unique" UNIQUE("booking_id","game_station_id"),
	CONSTRAINT "bookingstation_time_valid" CHECK ("start_time" < "end_time"),
	CONSTRAINT "bookingstation_playercount_valid" CHECK ("players_count" >= 1)
);
--> statement-breakpoint
ALTER TABLE "booking_stations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_game_station_id_game_stations_id_fkey";--> statement-breakpoint
DROP INDEX "gamestation_id_idx";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_no_station_overlap";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_no_device_overlap";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "game_station_id";--> statement-breakpoint
CREATE INDEX "bookingid_idx" ON "booking_stations" ("booking_id");--> statement-breakpoint
CREATE INDEX "stationid_idx" ON "booking_stations" ("game_station_id");--> statement-breakpoint
ALTER TABLE "booking_stations" ADD CONSTRAINT "booking_stations_game_station_id_game_stations_id_fkey" FOREIGN KEY ("game_station_id") REFERENCES "game_stations"("id");--> statement-breakpoint
ALTER TABLE "booking_stations" ADD CONSTRAINT "booking_stations_booking_id_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "booking_playercount_valid", ADD CONSTRAINT "booking_playercount_valid" CHECK ("players_count" >= 1);--> statement-breakpoint
CREATE POLICY "users_can_see_their_booked_stations" ON "booking_stations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
       EXISTS (
        SELECT 1 from bookings
        WHERE bookings.id = "booking_stations"."booking_id"
        AND bookings."userId" = (select auth.uid())
       )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "users_can_insert_booking_stations" ON "booking_stations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
      EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.id = "booking_stations"."booking_id"
        AND bookings."userId" = (select auth.uid())        
      )
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid())
        AND account_type = 'admin'
      )
      );--> statement-breakpoint
CREATE POLICY "admins_can_update_booked_stations" ON "booking_stations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )
        ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )
        );--> statement-breakpoint
CREATE POLICY "admins_can_delete_bookingstations" ON "booking_stations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )
        );