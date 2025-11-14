-- Create admin activity logs table
CREATE TABLE public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);

-- Function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_id uuid;
  action_type_val text;
  target_id uuid;
BEGIN
  -- Get the current admin user
  admin_id := auth.uid();
  
  IF TG_OP = 'INSERT' THEN
    action_type_val := 'role_assigned';
    target_id := NEW.user_id;
    
    -- Insert activity log
    INSERT INTO public.admin_activity_logs (admin_user_id, action_type, target_user_id, details)
    VALUES (admin_id, action_type_val, target_id, jsonb_build_object('role', NEW.role));
    
    -- Send notification to user about role change
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      NEW.user_id,
      'Role Updated',
      format('You have been assigned the %s role', NEW.role),
      'role_change',
      '/settings'
    );
    
  ELSIF TG_OP = 'DELETE' THEN
    action_type_val := 'role_revoked';
    target_id := OLD.user_id;
    
    -- Insert activity log
    INSERT INTO public.admin_activity_logs (admin_user_id, action_type, target_user_id, details)
    VALUES (admin_id, action_type_val, target_id, jsonb_build_object('role', OLD.role));
    
    -- Send notification to user about role revocation
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      OLD.user_id,
      'Role Revoked',
      format('Your %s role has been revoked', OLD.role),
      'role_change',
      '/settings'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for user_roles changes
CREATE TRIGGER log_user_role_changes
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_admin_activity();