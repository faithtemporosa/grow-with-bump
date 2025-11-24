-- Update the webhook function to use new URL and include all fields
CREATE OR REPLACE FUNCTION public.notify_n8n_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Make async HTTP POST request to n8n webhook with updated URL
  PERFORM net.http_post(
    url := 'https://faithtemporosa.app.n8n.cloud/webhook/1687a929-8c27-49ad-ab8c-78ff16125758',
    body := jsonb_build_object(
      'id', NEW.id,
      'name', NEW.name,
      'email', NEW.email,
      'brand_name', NEW.brand_name,
      'message', NEW.message,
      'cart_items', NEW.cart_items,
      'order_id', NEW.order_id,
      'order_total', NEW.order_total,
      'automation_count', NEW.automation_count,
      'status', NEW.status,
      'created_at', NEW.created_at
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to call webhook on new submissions
DROP TRIGGER IF EXISTS notify_webhook_on_contact_submission ON public.contact_submissions;
CREATE TRIGGER notify_webhook_on_contact_submission
AFTER INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_n8n_webhook();