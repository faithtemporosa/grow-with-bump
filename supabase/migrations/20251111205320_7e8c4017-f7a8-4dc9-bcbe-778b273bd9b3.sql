-- Remove the trigger that's causing the error
DROP TRIGGER IF EXISTS contact_submission_webhook ON public.contact_submissions;

-- Remove the function
DROP FUNCTION IF EXISTS notify_n8n_webhook();