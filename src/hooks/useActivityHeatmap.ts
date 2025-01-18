import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivityData {
  date: string;
  count: number;
  correct: number;
}

export function useActivityHeatmap() {
  const { user } = useAuth();
  const [data, setData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      if (!user) {
        setData([]);
        setIsLoading(false);
        return;
      }

      try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const { data: submissions, error } = await supabase
          .from('submissions')
          .select('created_at, is_correct')
          .eq('user_id', user.id)
          .gte('created_at', oneYearAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group submissions by date
        const groupedData = submissions.reduce((acc: Record<string, ActivityData>, submission) => {
          const date = new Date(submission.created_at).toISOString().split('T')[0];
          
          if (!acc[date]) {
            acc[date] = { date, count: 0, correct: 0 };
          }
          
          acc[date].count++;
          if (submission.is_correct) {
            acc[date].correct++;
          }
          
          return acc;
        }, {});

        setData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
  }, [user]);

  return { data, isLoading };
}