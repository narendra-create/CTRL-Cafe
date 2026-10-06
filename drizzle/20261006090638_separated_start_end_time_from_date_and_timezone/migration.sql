-- Drop the check constraint first before changing column types
ALTER TABLE "time_slots" DROP CONSTRAINT "time_valid";--> statement-breakpoint

-- Add the new timezone column
ALTER TABLE "time_slots" ADD COLUMN "time_zone" text NOT NULL;--> statement-breakpoint

-- Now safely convert both columns to time type
ALTER TABLE "time_slots" ALTER COLUMN "start_time" SET DATA TYPE time USING "start_time"::time;--> statement-breakpoint
ALTER TABLE "time_slots" ALTER COLUMN "end_time" SET DATA TYPE time USING "end_time"::time;--> statement-breakpoint

-- Re-add the check — now both sides are `time`, comparison works fine
ALTER TABLE "time_slots" ADD CONSTRAINT "time_valid" CHECK ("start_time" < "end_time");