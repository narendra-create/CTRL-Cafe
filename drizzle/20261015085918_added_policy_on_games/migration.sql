ALTER TABLE "available_games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "game_genre_idx" ON "available_games" ("game_genre");--> statement-breakpoint
CREATE INDEX "game_name_idx" ON "available_games" ("game_name");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "negetive_rewardpoint_check" CHECK ("reward_points" >= 0);--> statement-breakpoint
CREATE POLICY "only_admin_can_add_games" ON "available_games" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_update_games" ON "available_games" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        )) WITH CHECK (  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));--> statement-breakpoint
CREATE POLICY "only_admins_can_delete" ON "available_games" AS PERMISSIVE FOR DELETE TO "authenticated" USING (  EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (select auth.uid())
            AND account_type = 'admin'
        ));