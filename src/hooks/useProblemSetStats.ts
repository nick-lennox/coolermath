import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProblemSetStats {
  id: string;
  title: string;
  correct: number;
  total: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useProblemSetStats(dateRange: DateRange) {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProblemSetStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('submissions')
          .select(`
            is_correct,
            problem_sets (
              id,
              title
            )
          `)
          .eq('user_id', user.id)
          .eq('test_type', 'quiz')
          .not('problem_set_id', 'is', null)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString());

        if (error) throw error;

        // Aggregate stats by problem set
        const statsMap = data.reduce((acc: Record<string, ProblemSetStats>, submission) => {
          if (!submission.problem_sets) return acc;

          const { id, title } = submission.problem_sets;
          if (!acc[id]) {
            acc[id] = { id, title, correct: 0, total: 0 };
          }
          acc[id].total++;
          if (submission.is_correct) {
            acc[id].correct++;
          }
          return acc;
        }, {});

        setStats(Object.values(statsMap).sort((a, b) => b.total - a.total));
      } catch (error) {
        console.error('Error fetching problem set stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user, dateRange.startDate, dateRange.endDate]);

  return { stats, isLoading };
}