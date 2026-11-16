CREATE TYPE "booking_payment_method" AS ENUM('razorpay', 'cash', 'counter_upi', 'coupon_code');--> statement-breakpoint
CREATE TYPE "booking_source" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TYPE "coupon_status_enum" AS ENUM('expired', 'active', 'used');--> statement-breakpoint
CREATE TABLE "redeem_code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL UNIQUE,
	"valid_till" timestamp with time zone NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"code_status" "coupon_status_enum" DEFAULT 'active'::"coupon_status_enum" NOT NULL,
	"generated_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "redeem_code" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "booking_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booking_source" "booking_source" DEFAULT 'online'::"booking_source" NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payment_method" "booking_payment_method" DEFAULT 'razorpay'::"booking_payment_method" NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guest_name" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guest_phone" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booked_by_admin_id" uuid;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "redeem_code_used" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "redeem_code_id" uuid;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booked_by_admin_id_profiles_id_fkey" FOREIGN KEY ("booked_by_admin_id") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_redeem_code_id_redeem_code_id_fkey" FOREIGN KEY ("redeem_code_id") REFERENCES "redeem_code"("id");--> statement-breakpoint
ALTER TABLE "redeem_code" ADD CONSTRAINT "redeem_code_generated_by_id_profiles_id_fkey" FOREIGN KEY ("generated_by_id") REFERENCES "profiles"("id");--> statement-breakpoint
CREATE POLICY "users_can_see_their_booking_items" ON "booking_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
            EXISTS (
                SELECT 1 FROM bookings
                WHERE bookings.id = "booking_items"."booking_id"
                AND (bookings."userId" = (select auth.uid()) OR EXISTS (
                    SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND account_type = 'admin'
                ))
            )
        );--> statement-breakpoint
CREATE POLICY "users_and_admins_can_insert_booking_items" ON "booking_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
            EXISTS (
                SELECT 1 FROM bookings
                WHERE bookings.id = "booking_items"."booking_id"
                AND (bookings."userId" = (select auth.uid()) OR EXISTS (
                    SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND account_type = 'admin'
                ))
            )
        );--> statement-breakpoint
CREATE POLICY "admins_can_create_new_bookings" ON "bookings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "users_can_see_their_codes" ON "redeem_code" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "redeem_code"."generated_by_id");--> statement-breakpoint
CREATE POLICY "admins_can_see_all_codes" ON "redeem_code" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
        EXISTS(
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_generate_code" ON "redeem_code" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS(
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_update_codes" ON "redeem_code" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
        EXISTS(
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )) WITH CHECK (
        EXISTS(
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));