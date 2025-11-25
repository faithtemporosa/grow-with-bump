-- Fix contact_submissions table SELECT policy to prevent public data exposure
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view their own orders by email" ON public.contact_submissions;

-- Create a properly restricted policy
CREATE POLICY "Users can view their own orders"
ON public.contact_submissions 
FOR SELECT
TO authenticated
USING (
  email = (auth.jwt() ->> 'email')
  OR public.has_role(auth.uid(), 'admin')
);