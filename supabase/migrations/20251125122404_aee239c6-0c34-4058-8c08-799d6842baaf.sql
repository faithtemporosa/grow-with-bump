-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a trigger to securely log login activity server-side
CREATE OR REPLACE FUNCTION public.log_login_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.login_activity (
    user_id,
    user_agent,
    browser,
    os,
    city,
    country
  ) VALUES (
    NEW.id,
    'Server-tracked',
    'N/A',
    'N/A',
    'N/A',
    'N/A'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.log_login_activity();