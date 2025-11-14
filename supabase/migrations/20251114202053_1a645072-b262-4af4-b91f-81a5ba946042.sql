-- Add email column to profiles table
ALTER TABLE public.profiles
ADD COLUMN email text;

-- Update existing profiles with email from auth.users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.user_id = auth.users.id;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email_digest_enabled, email)
  VALUES (NEW.id, true, NEW.email);
  RETURN NEW;
END;
$function$;