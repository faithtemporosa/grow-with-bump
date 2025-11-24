-- Add columns to contact_submissions to track cart items and orders
ALTER TABLE public.contact_submissions
ADD COLUMN cart_items jsonb DEFAULT '[]'::jsonb,
ADD COLUMN order_total numeric DEFAULT 0,
ADD COLUMN automation_count integer DEFAULT 0;