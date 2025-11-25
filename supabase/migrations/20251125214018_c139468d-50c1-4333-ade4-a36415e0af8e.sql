-- Create subscriptions table to track user subscription status and limits
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  automation_limit integer NOT NULL DEFAULT 1,
  automations_used integer NOT NULL DEFAULT 0,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert subscriptions (webhook will use service role)
CREATE POLICY "System can insert subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (true);

-- System can update subscriptions (webhook will use service role)
CREATE POLICY "System can update subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create automation_usage table to track individual automation creation
CREATE TABLE public.automation_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  automation_id text NOT NULL,
  automation_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own usage"
  ON public.automation_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
  ON public.automation_usage
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can insert their own usage
CREATE POLICY "Users can insert their own usage"
  ON public.automation_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_automation_usage_user_id ON public.automation_usage(user_id);