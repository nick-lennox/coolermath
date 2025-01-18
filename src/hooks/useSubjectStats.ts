import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SubjectScore } from '../types/score';

interface SubjectStats {
  [key: string]: SubjectScore;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useSubjectStats(dateRange: DateRange) {
  const { user } = useAuth();
  const [subjectStats, setSubjectStats] = useState<SubjectStats>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchSubjectStats() {
      try {
        // Fetch all submissions within the date range
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            test_type,
            is_correct,
            created_at
          `)
          .eq('user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString());

        if (error) throw error;

        // Aggregate stats by test type
        const stats: SubjectStats = {};
        data.forEach(submission => {
          if (!stats[submission.test_type]) {
            stats[submission.test_type] = { correct: 0, total: 0 };
          }

          stats[submission.test_type].total++;
          if (submission.is_correct) {
            stats[submission.test_type].correct++;
          }
        });

        setSubjectStats(stats);
      } catch (error) {
        console.error('Error fetching subject stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubjectStats();
  }, [user, dateRange.startDate, dateRange.endDate]);

  return { subjectStats, isLoading };
}