-- Create login_activity table to track user logins
CREATE TABLE public.login_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT
);

-- Enable Row Level Security
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all login activity
CREATE POLICY "Admins can view all login activity"
ON public.login_activity
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_login_activity_user_id ON public.login_activity(user_id);
CREATE INDEX idx_login_activity_login_at ON public.login_activity(login_at DESC);
CREATE INDEX idx_login_activity_country ON public.login_activity(country);

-- Enable realtime for login activity
ALTER PUBLICATION supabase_realtime ADD TABLE public.login_activity;