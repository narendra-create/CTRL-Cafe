CREATE TABLE "available_games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"game_name" text NOT NULL UNIQUE,
	"game_genre" text,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "device_games" (
	"device_id" uuid,
	"game_id" uuid,
	CONSTRAINT "device_games_pkey" PRIMARY KEY("device_id","game_id")
);
--> statement-breakpoint
CREATE INDEX "device_games_game_id_idx" ON "device_games" ("game_id");--> statement-breakpoint
CREATE INDEX "device_games_device_id_idx" ON "device_games" ("device_id");--> statement-breakpoint
ALTER TABLE "device_games" ADD CONSTRAINT "device_games_device_id_devices_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "device_games" ADD CONSTRAINT "device_games_game_id_available_games_id_fkey" FOREIGN KEY ("game_id") REFERENCES "available_games"("id") ON DELETE CASCADE;