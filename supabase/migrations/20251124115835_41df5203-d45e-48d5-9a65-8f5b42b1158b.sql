-- Change cart_items from jsonb to text
ALTER TABLE public.contact_submissions 
ALTER COLUMN cart_items TYPE text USING 
  CASE 
    WHEN cart_items::text = '[]' THEN 'Legacy submission with no cart data'
    WHEN cart_items IS NULL THEN 'Legacy submission with no cart data'
    ELSE cart_items::text
  END;

-- Set default for cart_items
ALTER TABLE public.contact_submissions 
ALTER COLUMN cart_items SET DEFAULT 'No cart items';

-- Add order_id and status columns
ALTER TABLE public.contact_submissions
ADD COLUMN order_id text,
ADD COLUMN status text DEFAULT 'pending' NOT NULL;

-- Backfill order_id for existing rows
UPDATE public.contact_submissions
SET order_id = 'ORD-' || EXTRACT(EPOCH FROM created_at)::bigint || '-' || substring(id::text, 1, 8)
WHERE order_id IS NULL;

-- Create function to auto-generate order_id
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_id IS NULL THEN
    NEW.order_id := 'ORD-' || EXTRACT(EPOCH FROM NEW.created_at)::bigint || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate order_id on insert
CREATE TRIGGER set_order_id_on_insert
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_id();

-- Add indexes for faster lookups
CREATE INDEX idx_contact_submissions_order_id ON public.contact_submissions(order_id);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);