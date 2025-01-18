-- Insert sample problem sets
WITH first_set AS (
  INSERT INTO public.problem_sets (title, description, created_by, is_public)
  SELECT 
    'SAT Math Essentials',
    'A comprehensive collection of essential SAT Math problems covering algebra, geometry, and trigonometry.',
    auth.uid(),
    true
  FROM auth.users
  WHERE email = 'test@example.com'
  RETURNING id
),
second_set AS (
  INSERT INTO public.problem_sets (title, description, created_by, is_public)
  SELECT 
    'ACT Math Practice Set',
    'Practice problems specifically designed for ACT Math preparation, focusing on key concepts and time management.',
    auth.uid(),
    true
  FROM auth.users
  WHERE email = 'test@example.com'
  RETURNING id
),
sat_questions AS (
  SELECT id FROM questions WHERE test_type = 'SAT' LIMIT 5
),
act_questions AS (
  SELECT id FROM questions WHERE test_type = 'ACT' LIMIT 5
)
-- Insert questions for first problem set
INSERT INTO problem_set_questions (problem_set_id, question_id, "order")
SELECT 
  (SELECT id FROM first_set),
  q.id,
  row_number() OVER ()
FROM sat_questions q
WHERE EXISTS (SELECT 1 FROM first_set)
UNION ALL
-- Insert questions for second problem set
SELECT 
  (SELECT id FROM second_set),
  q.id,
  row_number() OVER ()
FROM act_questions q
WHERE EXISTS (SELECT 1 FROM second_set);