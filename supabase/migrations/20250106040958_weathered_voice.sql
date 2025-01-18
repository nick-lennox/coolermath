-- Drop existing constraint
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_test_type_check,
  DROP CONSTRAINT IF EXISTS submissions_type_check;

-- Add new constraint that allows quiz submissions
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_test_type_check
  CHECK (
    test_type IN ('SAT', 'ACT', 'AP_CALC_AB', 'AP_CALC_BC', 'quiz')
  );

-- Add index for test_type
CREATE INDEX IF NOT EXISTS idx_submissions_test_type ON submissions(test_type);