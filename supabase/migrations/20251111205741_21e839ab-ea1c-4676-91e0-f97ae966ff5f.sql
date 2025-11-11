-- Update the function to use the new webhook URL
CREATE OR REPLACE FUNCTION notify_n8n_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Make async HTTP POST request to n8n webhook with new URL
  PERFORM net.http_post(
    url := 'https://faithtemporosa.app.n8n.cloud/webhook/e2f8707f-4fc1-47f8-9978-d5a5a316fde0',
    body := jsonb_build_object(
      'id', NEW.id,
      'name', NEW.name,
      'email', NEW.email,
      'brand', NEW.brand_name,
      'message', NEW.message,
      'created_at', NEW.created_at
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;