import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DayProgress {
  date: string;
  correct: number;
  total: number;
  percentage: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useProgressData(dateRange: DateRange) {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<DayProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchProgressData() {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('created_at, is_correct')
          .eq('user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by date
        const dailyProgress: { [key: string]: DayProgress } = {};
        
        // Initialize all days in the range
        for (let d = new Date(dateRange.startDate); d < dateRange.endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          dailyProgress[dateStr] = {
            date: dateStr,
            correct: 0,
            total: 0,
            percentage: 0
          };
        }

        // Fill in the actual data
        data.forEach(submission => {
          const dateStr = new Date(submission.created_at).toISOString().split('T')[0];
          if (!dailyProgress[dateStr]) {
            dailyProgress[dateStr] = {
              date: dateStr,
              correct: 0,
              total: 0,
              percentage: 0
            };
          }
          dailyProgress[dateStr].total++;
          if (submission.is_correct) {
            dailyProgress[dateStr].correct++;
          }
        });

        // Calculate percentages and convert to array
        const progressArray = Object.values(dailyProgress).map(day => ({
          ...day,
          percentage: day.total > 0 ? Math.round((day.correct / day.total) * 100) : 0
        }));

        setProgressData(progressArray);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgressData();
  }, [user, dateRange.startDate, dateRange.endDate]);

  return { progressData, isLoading };
}