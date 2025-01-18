import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ExploreQuestion } from '../types/explore';
import { fetchQuestionStats } from '../lib/questions/stats';

interface UseExploreQuestionsProps {
  searchQuery?: string;
  subject?: string;
  difficulty?: string;
  successRate?: string;
}

export function useExploreQuestions({ 
  searchQuery, 
  subject,
  difficulty,
  successRate 
}: UseExploreQuestionsProps = {}) {
  const [questions, setQuestions] = useState<ExploreQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('questions')
          .select('id, test_type, topic, question_text, difficulty');

        // Apply filters
        if (searchQuery) {
          query = query.ilike('question_text', `%${searchQuery}%`);
        }
        
        // Map subject filter to test_type
        if (subject) {
          query = query.eq('test_type', subject);
        }
        
        // Map difficulty filter
        if (difficulty) {
          const difficultyMap: Record<string, string> = {
            'Easy': 'basic',
            'Medium': 'intermediate',
            'Hard': 'advanced',
            'Challenge': 'challenge'
          };
          query = query.eq('difficulty', difficultyMap[difficulty] || difficulty);
        }

        const { data: questionData, error: questionError } = await query;

        if (questionError) throw questionError;
        if (!questionData?.length) {
          setQuestions([]);
          return;
        }

        // Transform the data to match ExploreQuestion interface
        const transformedQuestions = questionData.map(q => ({
          id: q.id,
          title: q.question_text,
          subject: q.test_type,
          level: q.topic,
          difficulty: q.difficulty,
          attempts: 0,
          successRate: 0
        }));

        // Get stats for the questions
        const questionsWithStats = await fetchQuestionStats(transformedQuestions);

        // Apply success rate filter
        let filteredQuestions = questionsWithStats;
        if (successRate) {
          const [min, max] = successRate === 'Above 75%' ? [75, 100] :
                            successRate === '50% - 75%' ? [50, 75] :
                            [0, 50];
          
          filteredQuestions = filteredQuestions.filter(q => 
            q.successRate >= min && q.successRate < max
          );
        }

        setQuestions(filteredQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [searchQuery, subject, difficulty, successRate]);

  return { questions, isLoading, error };
}