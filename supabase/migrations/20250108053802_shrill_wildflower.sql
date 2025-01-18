-- Update submissions policy to handle anonymous submissions
DROP POLICY IF EXISTS "Users can create their own submissions" ON public.submissions;
CREATE POLICY "Anyone can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR  -- Allow anonymous submissions
    (auth.uid() = user_id)                       -- Or authenticated user submissions
  );

-- Update submissions_type_check constraint to allow null user_id
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_type_check,
  ADD CONSTRAINT submissions_type_check
  CHECK (
    (test_type IN ('SAT', 'ACT', 'AP_CALC_AB', 'AP_CALC_BC') AND problem_set_id IS NULL) OR
    (test_type = 'quiz')
  );