-- Fix audit tables: Make them immutable (prevent UPDATE/DELETE)
-- Login Activity - immutable audit log
DROP POLICY IF EXISTS "Deny updates to login activity" ON public.login_activity;
CREATE POLICY "Deny updates to login activity"
ON public.login_activity
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Deny deletes to login activity" ON public.login_activity;
CREATE POLICY "Deny deletes to login activity"
ON public.login_activity
FOR DELETE
USING (false);

-- Admin Activity Logs - immutable audit log
DROP POLICY IF EXISTS "Deny updates to admin logs" ON public.admin_activity_logs;
CREATE POLICY "Deny updates to admin logs"
ON public.admin_activity_logs
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Deny deletes to admin logs" ON public.admin_activity_logs;
CREATE POLICY "Deny deletes to admin logs"
ON public.admin_activity_logs
FOR DELETE
USING (false);

-- Subscriptions table - only service role can modify (explicit DENY for users)
DROP POLICY IF EXISTS "Deny user inserts to subscriptions" ON public.subscriptions;
CREATE POLICY "Deny user inserts to subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny user updates to subscriptions" ON public.subscriptions;
CREATE POLICY "Deny user updates to subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (false);

DROP POLICY IF EXISTS "Admins can delete subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Contact Submissions - admin-only delete
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Automation Usage - prevent tampering with usage records
DROP POLICY IF EXISTS "Deny updates to automation usage" ON public.automation_usage;
CREATE POLICY "Deny updates to automation usage"
ON public.automation_usage
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Admins can delete automation usage" ON public.automation_usage;
CREATE POLICY "Admins can delete automation usage"
ON public.automation_usage
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- User Roles - admin-only updates
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Profiles - users can delete their own, admins can delete any
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Wishlists - users can update their own
DROP POLICY IF EXISTS "Users can update their own wishlist" ON public.wishlists;
CREATE POLICY "Users can update their own wishlist"
ON public.wishlists
FOR UPDATE
USING (auth.uid() = user_id);