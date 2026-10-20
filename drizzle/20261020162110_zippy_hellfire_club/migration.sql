-- Fix EXCLUDE constraint: add 'hold' status and explicit range bound
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_no_device_overlap";

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_no_device_overlap"
EXCLUDE USING gist (
    "booked_device" WITH =,
    tstzrange("start_time", "end_time", '[)') WITH &&
)
WHERE (
    "booking_status" IN ('hold', 'pending', 'confirmed')
);