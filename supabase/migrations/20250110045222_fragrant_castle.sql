-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can read their own submissions" ON public.submissions;

-- Update submissions table constraints
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_type_check,
  ADD CONSTRAINT submissions_type_check
  CHECK (
    (test_type IN ('SAT', 'ACT', 'AP_CALC_AB', 'AP_CALC_BC') AND problem_set_id IS NULL) OR
    (test_type = 'quiz')
  );

-- Create new policies for submissions
CREATE POLICY "Users can create their own submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_test_type_user_id ON submissions(test_type, user_id);

-- Create view for submission stats
CREATE OR REPLACE VIEW submission_stats AS
SELECT 
  user_id,
  test_type,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100
  ) as success_rate
FROM submissions
GROUP BY user_id, test_type;

-- Grant access to the view
GRANT SELECT ON submission_stats TO authenticated;