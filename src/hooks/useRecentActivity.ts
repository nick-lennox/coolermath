import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  id: string;
  test_type: string;
  topic?: string;
  is_correct: boolean;
  created_at: string;
  submitted_answer: string;
  problem_set?: {
    title: string;
  };
  question: {
    text: string;
    latex?: string;
    difficulty: string;
    correct_answer: string;
    explanation: {
      text: string;
      latex?: string;
    };
  } | null;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useRecentActivity(dateRange: DateRange) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchRecentActivity() {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            id,
            test_type,
            topic,
            is_correct,
            created_at,
            submitted_answer,
            problem_set_id,
            problem_sets (
              title
            ),
            questions (
              question_text,
              question_latex,
              difficulty,
              correct_answer,
              explanation_text,
              explanation_latex
            )
          `)
          .eq('user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedActivities = data.map(activity => ({
          id: activity.id,
          test_type: activity.test_type,
          topic: activity.topic,
          is_correct: activity.is_correct,
          created_at: activity.created_at,
          submitted_answer: activity.submitted_answer,
          problem_set: activity.problem_sets ? {
            title: activity.problem_sets.title
          } : undefined,
          question: activity.questions ? {
            text: activity.questions.question_text,
            latex: activity.questions.question_latex || undefined,
            difficulty: activity.questions.difficulty,
            correct_answer: activity.questions.correct_answer,
            explanation: {
              text: activity.questions.explanation_text,
              latex: activity.questions.explanation_latex || undefined
            }
          } : null
        }));

        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentActivity();
  }, [user, dateRange.startDate, dateRange.endDate]);

  return { activities, isLoading };
}