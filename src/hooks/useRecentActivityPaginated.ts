import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface Activity {
  id: string;
  test_type: string;
  topic?: string;
  submitted_answer: string;
  is_correct: boolean;
  created_at: string;
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

export function useRecentActivityPaginated(dateRange: DateRange) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  useEffect(() => {
    if (!user) return;

    async function fetchRecentActivity() {
      try {
        setIsLoading(true);

        // First get total count
        const { count, error: countError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString());

        if (countError) throw countError;
        setTotalCount(count || 0);

        // Then fetch paginated data
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            id,
            test_type,
            topic,
            submitted_answer,
            is_correct,
            created_at,
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
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

        if (error) throw error;

        const transformedActivities = data.map(activity => ({
          id: activity.id,
          test_type: activity.test_type,
          topic: activity.topic,
          submitted_answer: activity.submitted_answer,
          is_correct: activity.is_correct,
          created_at: activity.created_at,
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
  }, [user, dateRange.startDate, dateRange.endDate, currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return { 
    activities, 
    isLoading, 
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      totalCount,
      goToPage,
      onPageSizeChange: handlePageSizeChange
    }
  };
}