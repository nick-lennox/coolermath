/*
  # Add test type and topic tracking to submissions

  1. Changes
    - Add test_type column to track the type of test (SAT, ACT, etc.)
    - Add topic column to track the subject/topic
    - Add level column for hierarchical categorization
    - Add language column for language-specific questions
    - Add constraints to ensure data consistency

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to submissions table
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS test_type TEXT,
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_submissions_test_type ON submissions(test_type);
CREATE INDEX IF NOT EXISTS idx_submissions_topic ON submissions(topic);

-- Update existing submissions with test_type and topic from questions
UPDATE submissions s
SET 
  test_type = q.test_type,
  topic = q.topic
FROM questions q
WHERE s.question_id = q.id;

-- Add check constraint to ensure test_type matches valid values
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_test_type_check 
  CHECK (test_type IN ('SAT', 'ACT', 'AP_CALC_AB', 'AP_CALC_BC'));

-- Make test_type NOT NULL after populating data
ALTER TABLE public.submissions
  ALTER COLUMN test_type SET NOT NULL;