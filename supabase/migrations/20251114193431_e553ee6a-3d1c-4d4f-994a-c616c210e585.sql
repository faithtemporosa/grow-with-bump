-- Create automations table to track changes
CREATE TABLE public.automations (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features TEXT[] NOT NULL,
  description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read automations
CREATE POLICY "Automations are viewable by everyone"
ON public.automations
FOR SELECT
USING (true);

-- Only service role can modify automations
CREATE POLICY "Only service role can modify automations"
ON public.automations
FOR ALL
USING (false);

-- Create function to notify wishlist users of automation updates
CREATE OR REPLACE FUNCTION public.notify_wishlist_users_on_automation_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  price_changed BOOLEAN;
  features_changed BOOLEAN;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Check what changed
  price_changed := OLD.price != NEW.price;
  features_changed := OLD.features != NEW.features;
  
  -- Only proceed if price or features changed
  IF NOT (price_changed OR features_changed) THEN
    RETURN NEW;
  END IF;
  
  -- Build notification message
  IF price_changed AND features_changed THEN
    notification_title := 'Price & Features Update';
    notification_message := format('%s now costs $%s and has new features!', NEW.name, NEW.price);
  ELSIF price_changed THEN
    notification_title := 'Price Update';
    IF NEW.price < OLD.price THEN
      notification_message := format('%s price dropped to $%s (was $%s)', NEW.name, NEW.price, OLD.price);
    ELSE
      notification_message := format('%s price updated to $%s', NEW.name, NEW.price);
    END IF;
  ELSE
    notification_title := 'New Features Added';
    notification_message := format('%s has new features available!', NEW.name);
  END IF;
  
  -- Insert notifications for all users who wishlisted this automation
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM public.wishlists 
    WHERE automation_id = NEW.id
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      user_record.user_id,
      notification_title,
      notification_message,
      'wishlist_update',
      '/automation/' || NEW.id
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger on automations table
CREATE TRIGGER trigger_notify_wishlist_on_update
AFTER UPDATE ON public.automations
FOR EACH ROW
EXECUTE FUNCTION public.notify_wishlist_users_on_automation_update();

-- Create index for faster lookups
CREATE INDEX idx_automations_last_updated ON public.automations(last_updated);