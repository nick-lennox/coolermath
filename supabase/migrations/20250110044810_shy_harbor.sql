-- Create a regular view for problem sets with creators
CREATE OR REPLACE VIEW problem_sets_with_creators AS
SELECT 
  ps.id,
  ps.title,
  ps.description,
  ps.created_by,
  ps.is_public,
  ps.created_at,
  ps.updated_at,
  p.username as creator_username
FROM problem_sets ps
LEFT JOIN profiles p ON ps.created_by = p.id;

-- Grant access to the view
GRANT SELECT ON problem_sets_with_creators TO authenticated;

-- Update RLS policies on the base table
DROP POLICY IF EXISTS "Users can create their own problem sets" ON public.problem_sets;
CREATE POLICY "Users can create their own problem sets"
  ON public.problem_sets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view public problem sets" ON public.problem_sets;
CREATE POLICY "Users can view public problem sets"
  ON public.problem_sets FOR SELECT
  TO authenticated
  USING (
    is_public = true 
    OR created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update their own problem sets" ON public.problem_sets;
CREATE POLICY "Users can update their own problem sets"
  ON public.problem_sets FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own problem sets" ON public.problem_sets;
CREATE POLICY "Users can delete their own problem sets"
  ON public.problem_sets FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);