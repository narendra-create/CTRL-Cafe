CREATE TYPE "account_type" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "device_type" AS ENUM('console', 'pc', 'arcade', 'vr');--> statement-breakpoint
CREATE TYPE "food_category" AS ENUM('food', 'beverage', 'snacks', 'dessert');--> statement-breakpoint
CREATE TYPE "gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"total_amount" numeric(10,2) NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"booked_device" uuid NOT NULL,
	"players_count" integer DEFAULT 1 NOT NULL,
	"booking_status" "booking_status" DEFAULT 'pending'::"booking_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"device_name" text NOT NULL UNIQUE,
	"type" "device_type" NOT NULL,
	"max_players" integer NOT NULL,
	"hourly_rate" numeric(8,2) NOT NULL,
	"extra_console_price" numeric(5,2)
);
--> statement-breakpoint
CREATE TABLE "food_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"description" text,
	"price" numeric(10,2) NOT NULL,
	"serves" integer DEFAULT 1 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"category" "food_category" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY,
	"full_name" text,
	"phone" text,
	"avatar_url" text,
	"date_of_birth" date,
	"gender" "gender",
	"account_type" "account_type" DEFAULT 'user'::"account_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"available_devices" "device_type"[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_profiles_id_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booked_device_devices_id_fkey" FOREIGN KEY ("booked_device") REFERENCES "devices"("id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;