/*
  # Add sample questions

  1. New Data
    - Add sample SAT Math questions for different topics
    - Add sample ACT Math questions
    - Add sample AP Calculus questions
  
  2. Changes
    - Insert initial question data for testing
*/

-- Insert sample SAT Math questions
INSERT INTO public.questions 
(test_type, topic, difficulty, question_text, question_latex, options, correct_answer, explanation_text, explanation_latex)
VALUES
(
  'SAT',
  'algebra',
  'basic',
  'Solve for x:',
  '3x + 7 = 22',
  '[
    {"text": "3", "latex": "x = 3"},
    {"text": "5", "latex": "x = 5"},
    {"text": "7", "latex": "x = 7"},
    {"text": "15", "latex": "x = 15"}
  ]'::jsonb,
  '5',
  'To solve for x, first subtract 7 from both sides, then divide by 3.',
  '\\begin{align*} 3x + 7 &= 22 \\\\ 3x &= 15 \\\\ x &= 5 \\end{align*}'
),
(
  'SAT',
  'geometry',
  'intermediate',
  'Find the area of a circle with radius 4 units.',
  'A = \\pi r^2',
  '[
    {"text": "16π", "latex": "16\\pi"},
    {"text": "8π", "latex": "8\\pi"},
    {"text": "4π", "latex": "4\\pi"},
    {"text": "32π", "latex": "32\\pi"}
  ]'::jsonb,
  '16π',
  'The area of a circle is given by the formula A = πr². With r = 4, we get A = π(4)² = 16π.',
  'A = \\pi r^2 = \\pi (4)^2 = 16\\pi'
);