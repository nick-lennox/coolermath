-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can read their own submissions" ON public.submissions;

-- Create new policies for submissions
CREATE POLICY "Users can create their own submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create view for user activity
CREATE OR REPLACE VIEW user_activity AS
SELECT 
  s.user_id,
  s.test_type,
  s.topic,
  s.is_correct,
  s.submitted_answer,
  s.created_at,
  s.problem_set_id,
  ps.title as problem_set_title,
  q.question_text,
  q.question_latex,
  q.difficulty,
  q.correct_answer,
  q.explanation_text,
  q.explanation_latex
FROM submissions s
LEFT JOIN questions q ON s.question_id = q.id
LEFT JOIN problem_sets ps ON s.problem_set_id = ps.id;

-- Grant access to the view
GRANT SELECT ON user_activity TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id_created_at 
  ON submissions(user_id, created_at DESC);

-- Create view for user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  user_id,
  test_type,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100
  ) as success_rate,
  MAX(created_at) as last_attempt
FROM submissions
GROUP BY user_id, test_type;