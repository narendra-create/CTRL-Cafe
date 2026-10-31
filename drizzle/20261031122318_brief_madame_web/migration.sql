-- 1. Ensure the btree_gist extension is active
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 3. Add the exclusion constraint on booking_stations
ALTER TABLE "booking_stations"
ADD CONSTRAINT "booking_stations_no_overlap"
EXCLUDE USING gist (
    "game_station_id" WITH =,
    tstzrange("start_time", "end_time", '[)') WITH &&
);--> statement-breakpoint