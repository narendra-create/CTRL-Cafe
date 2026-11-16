CREATE INDEX "redeem_code_generator_idx" ON "redeem_code" ("generated_by_id");--> statement-breakpoint
CREATE INDEX "redeem_code_status_idx" ON "redeem_code" ("code_status");--> statement-breakpoint
ALTER TABLE "redeem_code" ADD CONSTRAINT "negetive_balance_check_on_redeem_code" CHECK ("balance" >= 0);