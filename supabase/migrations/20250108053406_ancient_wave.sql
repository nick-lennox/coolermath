-- Update RLS policy for questions to allow public access
DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  USING (true);