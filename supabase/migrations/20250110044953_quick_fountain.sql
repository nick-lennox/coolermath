-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policies for profiles
CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Update problem_sets_with_creators view
DROP VIEW IF EXISTS problem_sets_with_creators;
CREATE VIEW problem_sets_with_creators AS
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