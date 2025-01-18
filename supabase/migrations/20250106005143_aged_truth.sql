/*
  # Fix subjects and questions structure

  1. Changes
    - Drop old subjects table and recreate with correct structure
    - Update questions table to use test_type directly
    - Add missing indexes
    - Update RLS policies

  2. Data
    - Remove subject references since we're using test_type directly
*/

-- Drop old subjects table and related objects
DROP TABLE IF EXISTS public.subjects CASCADE;

-- Remove subject column from questions
ALTER TABLE public.questions DROP COLUMN IF EXISTS subject;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_questions_test_type_topic ON questions(test_type, topic);
CREATE INDEX IF NOT EXISTS idx_questions_test_type_difficulty ON questions(test_type, difficulty);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  TO authenticated
  USING (true);