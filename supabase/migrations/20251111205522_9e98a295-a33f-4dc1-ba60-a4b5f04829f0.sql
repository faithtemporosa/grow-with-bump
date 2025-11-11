-- Create a function to send contact submission to n8n webhook using correct pg_net syntax
CREATE OR REPLACE FUNCTION notify_n8n_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Make async HTTP POST request to n8n webhook using correct pg_net syntax
  PERFORM net.http_post(
    url := 'https://bumpsyndicate.app.n8n.cloud/webhook/8ed9baf1-c53f-4a29-a7cd-dff6d0c34668',
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

-- Create trigger to fire on INSERT to contact_submissions
DROP TRIGGER IF EXISTS contact_submission_webhook ON public.contact_submissions;

CREATE TRIGGER contact_submission_webhook
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_n8n_webhook();