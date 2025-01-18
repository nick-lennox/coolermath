-- Add problem_set_id column to submissions table
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS problem_set_id UUID REFERENCES problem_sets(id) ON DELETE CASCADE;

-- Create index for problem_set_id
CREATE INDEX IF NOT EXISTS idx_submissions_problem_set_id ON submissions(problem_set_id);

-- Update RLS policies to allow access to problem set submissions
DROP POLICY IF EXISTS "Users can read their own submissions" ON public.submissions;
CREATE POLICY "Users can read their own submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM problem_sets
      WHERE id = problem_set_id
      AND created_by = auth.uid()
    )
  );

-- Add constraint to ensure either test_type or problem_set_id is set
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_type_check,
  ADD CONSTRAINT submissions_type_check
  CHECK (
    (test_type IS NOT NULL AND problem_set_id IS NULL) OR
    (test_type = 'quiz' AND problem_set_id IS NOT NULL)
  );