ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "devices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "food_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "time_slots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE POLICY "users_can_book_for_their_own" ON "bookings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "bookings"."userId");--> statement-breakpoint
CREATE POLICY "users_can_see_their_bookings" ON "bookings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "bookings"."userId");--> statement-breakpoint
CREATE POLICY "users_can_update_their_bookings" ON "bookings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "bookings"."userId" AND "bookings"."booking_status" = 'pending') WITH CHECK ((select auth.uid()) = "bookings"."userId");--> statement-breakpoint
CREATE POLICY "admins_can_see_all_bookings" ON "bookings" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid()) 
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "admins_can_edit_all_bookings" ON "bookings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
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
CREATE POLICY "all_users_can_see_devices" ON "devices" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "only_admins_can_insert" ON "devices" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_delete" ON "devices" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_update" ON "devices" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
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
CREATE POLICY "all_users_can_see" ON "food_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "only_admins_can_add" ON "food_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_delete" ON "food_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "users_can_select_their_profile" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."id");--> statement-breakpoint
CREATE POLICY "users_can_update_their_profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."id") WITH CHECK ((select auth.uid()) = "profiles"."id");--> statement-breakpoint
CREATE POLICY "users_insert_own_profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles"."id");--> statement-breakpoint
CREATE POLICY "anyone_can_see" ON "time_slots" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "only_admins_can_add" ON "time_slots" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_update" ON "time_slots" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
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
CREATE POLICY "only_admins_can_delete" ON "time_slots" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));