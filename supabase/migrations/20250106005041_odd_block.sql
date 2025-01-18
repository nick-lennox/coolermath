/*
  # Fix Schema for Math Test Preparation Platform

  1. Changes
    - Add subjects table for test types and topics
    - Update questions table with correct columns
    - Add missing indexes
    
  2. Security
    - Enable RLS on new table
    - Add appropriate policies
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  has_level BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add initial subject data
INSERT INTO public.subjects (id, name, icon, has_level) VALUES
  ('sat_math', 'SAT Math', 'Calculator', true),
  ('act_math', 'ACT Math', 'Calculator', true),
  ('ap_calc_ab', 'AP Calculus AB', 'Calculator', false),
  ('ap_calc_bc', 'AP Calculus BC', 'Calculator', false)
ON CONFLICT (id) DO NOTHING;

-- Add missing columns to questions table
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS subject TEXT REFERENCES subjects(id),
  ADD COLUMN IF NOT EXISTS level TEXT;

-- Create index for subject column
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);

-- Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Add policy for subjects table
DROP POLICY IF EXISTS "Anyone can read subjects" ON public.subjects;
CREATE POLICY "Anyone can read subjects"
  ON public.subjects FOR SELECT
  TO authenticated
  USING (true);