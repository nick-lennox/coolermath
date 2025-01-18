-- Drop existing constraint
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_type_check;

-- Add new constraint that allows quiz submissions without problem_set_id
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_type_check
  CHECK (
    (test_type IN ('SAT', 'ACT', 'AP_CALC_AB', 'AP_CALC_BC') AND problem_set_id IS NULL) OR
    (test_type = 'quiz')
  );