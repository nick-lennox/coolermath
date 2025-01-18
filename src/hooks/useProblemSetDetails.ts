import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProblemSet } from '../types/problemSet';
import { QuizQuestion } from '../types/quiz';
import { useAuth } from '../contexts/AuthContext';

interface ProblemSetDetails {
  problemSet: ProblemSet | null;
  questions: QuizQuestion[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProblemSetDetails(problemSetId: string): ProblemSetDetails {
  const { user } = useAuth();
  const [problemSet, setProblemSet] = useState<ProblemSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblemSetDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch problem set details
      const { data: problemSetData, error: problemSetError } = await supabase
        .from('problem_sets')
        .select(`
          id,
          title,
          description,
          created_by,
          is_public,
          created_at,
          updated_at
        `)
        .eq('id', problemSetId)
        .single();

      if (problemSetError) throw problemSetError;

      // Get creator's username
      const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', problemSetData.created_by)
        .single();

      // Fetch questions with full details needed for quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('problem_set_questions')
        .select(`
          *,
          questions (
            id,
            question_text,
            question_latex,
            options,
            correct_answer
          )
        `)
        .eq('problem_set_id', problemSetId)
        .order('order');

      if (questionsError) throw questionsError;

      // If user is logged in, fetch their attempts
      let attempts = {};
      if (user) {
        const { data: attemptsData } = await supabase
          .from('submissions')
          .select('question_id, is_correct')
          .eq('user_id', user.id)
          .in('question_id', questionsData.map(q => q.questions.id));

        attempts = (attemptsData || []).reduce((acc: Record<string, boolean>, attempt) => {
          acc[attempt.question_id] = attempt.is_correct;
          return acc;
        }, {});
      }

      // Transform the data
      setProblemSet({
        ...problemSetData,
        created_by: creatorProfile?.username || 'Unknown User'
      });

      // Transform questions into quiz format
      const transformedQuestions: QuizQuestion[] = questionsData.map(q => ({
        id: q.questions.id,
        question: {
          text: q.questions.question_text,
          latex: q.questions.question_latex
        },
        options: typeof q.questions.options === 'string' 
          ? JSON.parse(q.questions.options)
          : q.questions.options,
        correctAnswer: q.questions.correct_answer,
        attempted: q.questions.id in attempts,
        correct: attempts[q.questions.id] || false
      }));

      setQuestions(transformedQuestions);
    } catch (err) {
      console.error('Error fetching problem set details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch problem set details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemSetDetails();
  }, [problemSetId, user]);

  return { problemSet, questions, isLoading, error, refetch: fetchProblemSetDetails };
}