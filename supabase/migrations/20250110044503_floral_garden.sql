-- Create a view to join problem sets with profiles for username display
CREATE OR REPLACE VIEW problem_sets_with_creators AS
SELECT 
  ps.*,
  p.username as creator_username
FROM problem_sets ps
LEFT JOIN profiles p ON ps.created_by = p.id;

-- Ensure proper RLS policies
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