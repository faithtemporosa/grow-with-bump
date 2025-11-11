-- Fix security warnings by setting search_path for the function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;