-- Enable the pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send contact submission to n8n webhook
CREATE OR REPLACE FUNCTION notify_n8n_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://bumpsyndicate.app.n8n.cloud/webhook/8ed9baf1-c53f-4a29-a7cd-dff6d0c34668';
  payload JSONB;
BEGIN
  -- Build the payload with the new contact submission data
  payload := jsonb_build_object(
    'id', NEW.id,
    'name', NEW.name,
    'email', NEW.email,
    'brand', NEW.brand_name,
    'message', NEW.message,
    'created_at', NEW.created_at
  );

  -- Make async HTTP POST request to n8n webhook
  PERFORM net.http_post(
    url := webhook_url,
    body := payload::TEXT,
    headers := '{"Content-Type": "application/json"}'::JSONB
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to fire on INSERT to contact_submissions
DROP TRIGGER IF EXISTS contact_submission_webhook ON public.contact_submissions;

CREATE TRIGGER contact_submission_webhook
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_n8n_webhook();