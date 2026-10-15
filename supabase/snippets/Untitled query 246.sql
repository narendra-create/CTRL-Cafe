-- =====================================================
-- 1. CUSTOM ACCESS TOKEN HOOK
-- =====================================================

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  claims jsonb := event -> 'claims';
  user_account_type text;
BEGIN
  SELECT p.account_type::text
  INTO user_account_type
  FROM public.profiles AS p
  WHERE p.id = (event ->> 'user_id')::uuid;

  IF jsonb_typeof(claims -> 'app_metadata') IS DISTINCT FROM 'object' THEN
    claims := jsonb_set(claims, '{app_metadata}', '{}'::jsonb, true);
  END IF;

  claims := jsonb_set(
    claims,
    '{app_metadata,account_type}',
    to_jsonb(COALESCE(user_account_type, 'user')),
    true
  );

  event := jsonb_set(event, '{claims}', claims, true);
  RETURN event;
END;
$$;

-- =====================================================
-- 2. AUTH SERVICE PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

REVOKE SELECT ON TABLE public.profiles FROM supabase_auth_admin;
GRANT SELECT (id, account_type) ON TABLE public.profiles TO supabase_auth_admin;

DROP POLICY IF EXISTS "supabase_auth_admin_can_read_profile_roles" ON public.profiles;
CREATE POLICY "supabase_auth_admin_can_read_profile_roles"
  ON public.profiles FOR SELECT
  TO supabase_auth_admin
  USING (true);

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM PUBLIC, anon, authenticated;

-- =====================================================
-- 3. ROLE-PROTECTION TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION public.protect_account_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.account_type := 'user'::public.account_type;
    ELSIF NEW.account_type IS DISTINCT FROM OLD.account_type THEN
      RAISE EXCEPTION 'account_type cannot be modified through the application';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_account_type_immutable ON public.profiles;
CREATE TRIGGER enforce_account_type_immutable
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_account_type();

-- =====================================================
-- 4. NON-NEGATIVE REWARD POINTS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_reward_points_non_negative'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_reward_points_non_negative
      CHECK (reward_points >= 0);
  END IF;
END;
$$;