-- Add sample ACT Math questions
INSERT INTO public.questions 
(test_type, topic, difficulty, question_text, question_latex, options, correct_answer, explanation_text, explanation_latex)
VALUES
(
  'ACT',
  'algebra',
  'basic',
  'Factor the quadratic expression:',
  'x^2 + 5x + 6',
  '[
    {"text": "(x + 2)(x + 3)", "latex": "(x + 2)(x + 3)"},
    {"text": "(x + 1)(x + 6)", "latex": "(x + 1)(x + 6)"},
    {"text": "(x + 3)(x + 2)", "latex": "(x + 3)(x + 2)"},
    {"text": "(x - 2)(x - 3)", "latex": "(x - 2)(x - 3)"}
  ]'::jsonb,
  '(x + 2)(x + 3)',
  'To factor this quadratic, find two numbers that add to 5 and multiply to 6. These numbers are 2 and 3.',
  '\\begin{align*} x^2 + 5x + 6 &= x^2 + 2x + 3x + 6 \\\\ &= (x + 2)(x + 3) \\end{align*}'
),
(
  'ACT',
  'geometry',
  'intermediate',
  'In a right triangle, if one leg is 8 and the hypotenuse is 17, what is the length of the other leg?',
  null,
  '[
    {"text": "15", "latex": "15"},
    {"text": "16", "latex": "16"},
    {"text": "13", "latex": "13"},
    {"text": "12", "latex": "12"}
  ]'::jsonb,
  '15',
  'Use the Pythagorean theorem: a² + b² = c². If one leg is 8 and the hypotenuse is 17, then: 8² + x² = 17²',
  '\\begin{align*} 8^2 + x^2 &= 17^2 \\\\ 64 + x^2 &= 289 \\\\ x^2 &= 225 \\\\ x &= 15 \\end{align*}'
);

-- Add sample AP Calculus AB questions
INSERT INTO public.questions 
(test_type, topic, difficulty, question_text, question_latex, options, correct_answer, explanation_text, explanation_latex)
VALUES
(
  'AP_CALC_AB',
  'derivatives',
  'intermediate',
  'Find the derivative of:',
  'f(x) = x^3\\sin(x)',
  '[
    {"text": "3x²sin(x) + x³cos(x)", "latex": "3x^2\\sin(x) + x^3\\cos(x)"},
    {"text": "3x²sin(x)", "latex": "3x^2\\sin(x)"},
    {"text": "x³cos(x)", "latex": "x^3\\cos(x)"},
    {"text": "3x²sin(x) - x³cos(x)", "latex": "3x^2\\sin(x) - x^3\\cos(x)"}
  ]'::jsonb,
  '3x²sin(x) + x³cos(x)',
  'Use the product rule: d/dx[u·v] = u·dv/dx + v·du/dx. Here, u = x³ and v = sin(x).',
  '\\begin{align*} \\frac{d}{dx}[x^3\\sin(x)] &= x^3\\frac{d}{dx}[\\sin(x)] + \\sin(x)\\frac{d}{dx}[x^3] \\\\ &= x^3\\cos(x) + \\sin(x)(3x^2) \\\\ &= 3x^2\\sin(x) + x^3\\cos(x) \\end{align*}'
);

-- Add sample AP Calculus BC questions
INSERT INTO public.questions 
(test_type, topic, difficulty, question_text, question_latex, options, correct_answer, explanation_text, explanation_latex)
VALUES
(
  'AP_CALC_BC',
  'series',
  'advanced',
  'Determine whether the following series converges or diverges:',
  '\\sum_{n=1}^{\\infty} \\frac{2^n}{n!}',
  '[
    {"text": "Converges", "latex": "\\text{Converges}"},
    {"text": "Diverges", "latex": "\\text{Diverges}"},
    {"text": "Oscillates", "latex": "\\text{Oscillates}"},
    {"text": "Cannot be determined", "latex": "\\text{Cannot be determined}"}
  ]'::jsonb,
  'Converges',
  'Use the ratio test. Take the limit of the ratio of consecutive terms. If the limit is less than 1, the series converges.',
  '\\begin{align*} \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| &= \\lim_{n \\to \\infty} \\left|\\frac{2^{n+1}/(n+1)!}{2^n/n!}\\right| \\\\ &= \\lim_{n \\to \\infty} \\frac{2}{n+1} = 0 < 1 \\end{align*}'
);