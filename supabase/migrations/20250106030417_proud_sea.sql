-- Add foreign key constraint for created_by to profiles
ALTER TABLE public.problem_sets
  DROP CONSTRAINT IF EXISTS problem_sets_created_by_fkey,
  ADD CONSTRAINT problem_sets_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for profiles relationship
ALTER TABLE public.problem_sets
  DROP CONSTRAINT IF EXISTS problem_sets_created_by_profiles_fkey,
  ADD CONSTRAINT problem_sets_created_by_profiles_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES profiles(id) ON DELETE CASCADE;

-- Update the RLS policies to use the new relationship
DROP POLICY IF EXISTS "Users can view public problem sets" ON public.problem_sets;
CREATE POLICY "Users can view public problem sets"
  ON public.problem_sets FOR SELECT
  TO authenticated
  USING (
    is_public = true 
    OR created_by IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Create index for the new relationship
CREATE INDEX IF NOT EXISTS idx_problem_sets_created_by_profiles 
  ON problem_sets(created_by);