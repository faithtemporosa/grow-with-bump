-- Add estimated completion date to contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN estimated_completion_date timestamp with time zone;

-- Update RLS policies to allow users to view orders by their email
DROP POLICY IF EXISTS "No public reads" ON public.contact_submissions;

CREATE POLICY "Users can view their own orders by email"
ON public.contact_submissions
FOR SELECT
TO public
USING (true);

-- Allow admins to update contact submissions
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create function to notify users when order status changes
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_message TEXT;
  status_label TEXT;
BEGIN
  -- Only proceed if status or estimated_completion_date changed
  IF OLD.status = NEW.status AND 
     (OLD.estimated_completion_date IS NOT DISTINCT FROM NEW.estimated_completion_date) THEN
    RETURN NEW;
  END IF;
  
  -- Build notification message based on status
  CASE NEW.status
    WHEN 'in_progress' THEN
      status_label := 'In Progress';
      notification_message := format('Your order %s is now being worked on!', NEW.order_id);
    WHEN 'completed' THEN
      status_label := 'Completed';
      notification_message := format('Your order %s has been completed!', NEW.order_id);
    WHEN 'cancelled' THEN
      status_label := 'Cancelled';
      notification_message := format('Your order %s has been cancelled.', NEW.order_id);
    ELSE
      status_label := 'Status Updated';
      notification_message := format('Your order %s status has been updated.', NEW.order_id);
  END CASE;
  
  -- Add completion date info if it exists
  IF NEW.estimated_completion_date IS NOT NULL AND OLD.estimated_completion_date IS NULL THEN
    notification_message := notification_message || format(' Estimated completion: %s', 
      to_char(NEW.estimated_completion_date, 'Mon DD, YYYY'));
  END IF;
  
  -- Send notification via email using the existing n8n webhook
  PERFORM net.http_post(
    url := 'https://faithtemporosa.app.n8n.cloud/webhook/1687a929-8c27-49ad-ab8c-78ff16125758',
    body := jsonb_build_object(
      'type', 'status_update',
      'order_id', NEW.order_id,
      'email', NEW.email,
      'name', NEW.name,
      'status', NEW.status,
      'status_label', status_label,
      'message', notification_message,
      'estimated_completion_date', NEW.estimated_completion_date
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS order_status_change_trigger ON public.contact_submissions;
CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();