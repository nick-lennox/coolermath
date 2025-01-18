/*
  # Problem Sets Schema

  1. New Tables
    - `problem_sets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `created_by` (uuid, references auth.users)
      - `is_public` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `problem_set_questions`
      - `id` (uuid, primary key)
      - `problem_set_id` (uuid, references problem_sets)
      - `question_id` (uuid, references questions)
      - `order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create problem_sets table
CREATE TABLE IF NOT EXISTS public.problem_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create problem_set_questions table
CREATE TABLE IF NOT EXISTS public.problem_set_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_set_id UUID NOT NULL REFERENCES problem_sets(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(problem_set_id, question_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_problem_sets_created_by ON problem_sets(created_by);
CREATE INDEX IF NOT EXISTS idx_problem_sets_is_public ON problem_sets(is_public);
CREATE INDEX IF NOT EXISTS idx_problem_set_questions_problem_set_id ON problem_set_questions(problem_set_id);
CREATE INDEX IF NOT EXISTS idx_problem_set_questions_order ON problem_set_questions("order");

-- Enable RLS
ALTER TABLE public.problem_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_set_questions ENABLE ROW LEVEL SECURITY;

-- Policies for problem_sets
CREATE POLICY "Users can create their own problem sets"
  ON public.problem_sets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view public problem sets"
  ON public.problem_sets FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can update their own problem sets"
  ON public.problem_sets FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own problem sets"
  ON public.problem_sets FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for problem_set_questions
CREATE POLICY "Users can manage questions in their own problem sets"
  ON public.problem_set_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM problem_sets
      WHERE id = problem_set_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view questions in public problem sets"
  ON public.problem_set_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM problem_sets
      WHERE id = problem_set_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );