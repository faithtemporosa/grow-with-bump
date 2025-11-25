-- Fix 1: Add explicit public access denial for profiles table
DROP POLICY IF EXISTS "Deny public access to profiles" ON public.profiles;
CREATE POLICY "Deny public access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

-- Fix 2: Add INSERT policy for login_activity (admin/system only)
DROP POLICY IF EXISTS "System can insert login activity" ON public.login_activity;
CREATE POLICY "System can insert login activity"
ON public.login_activity
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 3: Add INSERT policy for admin_activity_logs (admin only)
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 4: Add INSERT policy for notifications (admin only)
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 5: Restrict subscriptions table policies (service role only)
DROP POLICY IF EXISTS "System can insert subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;

-- These policies are now removed entirely since the Stripe webhook uses service role key
-- which bypasses RLS automatically. This prevents any authenticated user from manipulating subscriptions.

-- Fix 6: Add rate limiting note for contact_submissions
-- Note: Rate limiting should be implemented at the application/edge function level
-- The current RLS policies are appropriate for preventing unauthorized access
-- Additional protection against spam should be added via edge functions