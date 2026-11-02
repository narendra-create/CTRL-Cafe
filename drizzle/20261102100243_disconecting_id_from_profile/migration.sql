ALTER TABLE "profiles" DROP CONSTRAINT "profiles_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET 
    full_name = 'Deleted User',
    phone = NULL,
    avatar_url = NULL,
    date_of_birth = NULL,
    gender = NULL,
    reward_points = 0,
    deleted_at = now()
  WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;--> statement-breakpoint
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;--> statement-breakpoint
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_deleted_user();