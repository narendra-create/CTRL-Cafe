ALTER TABLE "device_games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "anyone_can_see" ON "available_games" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "admins_can_insert" ON "device_games" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "admins_can_delete" ON "device_games" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "anyone_can_view_this_junction" ON "device_games" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);