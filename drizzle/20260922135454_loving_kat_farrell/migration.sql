CREATE TYPE "deviceType" AS ENUM('console', 'pc', 'arcade', 'vr');--> statement-breakpoint
CREATE TYPE "food_category" AS ENUM('food', 'beverage', 'snacks', 'dessert');--> statement-breakpoint
CREATE TYPE "gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"device_name" text NOT NULL,
	"type" "deviceType" NOT NULL,
	"max_players" integer NOT NULL,
	"hourly_rate" numeric(8,2) NOT NULL,
	"extra_console_price" numeric(5,2)
);
--> statement-breakpoint
CREATE TABLE "food_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10,2),
	"serves" integer,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"category" "food_category" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET NOT NULL;