/*
  # Update problem_sets foreign key relationship

  1. Changes
    - Drop existing foreign key constraint from problem_sets.created_by to auth.users
    - Add new foreign key constraint from problem_sets.created_by to profiles
    - Update RLS policies to use the new relationship

  2. Security
    - Maintain existing RLS policies but update them to use the new relationship
*/

-- Drop existing foreign key constraints
ALTER TABLE public.problem_sets
  DROP CONSTRAINT IF EXISTS problem_sets_created_by_fkey,
  DROP CONSTRAINT IF EXISTS problem_sets_created_by_profiles_fkey;

-- Add new foreign key constraint to profiles
ALTER TABLE public.problem_sets
  ADD CONSTRAINT problem_sets_created_by_profiles_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES profiles(id) ON DELETE CASCADE;

-- Update RLS policies to use the new relationship
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

-- Create index for the new relationship if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_problem_sets_created_by_profiles 
  ON problem_sets(created_by);