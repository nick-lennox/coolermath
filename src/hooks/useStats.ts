import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface Stats {
  totalCorrect: number;
  accuracy: number;
  streak: number;
}

export function useStats(dateRange: DateRange) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalCorrect: 0, accuracy: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('is_correct, created_at')
          .eq('user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lt('created_at', dateRange.endDate.toISOString());

        if (error) throw error;

        const totalCorrect = data.filter(s => s.is_correct).length;
        const accuracy = data.length > 0 
          ? Math.round((totalCorrect / data.length) * 100) 
          : 0;

        // Calculate streak within the date range
        const dates = [...new Set(
          data.map(s => new Date(s.created_at).toDateString())
        )].sort();
        
        let streak = 0;
        const today = new Date().toDateString();
        for (let i = dates.length - 1; i >= 0; i--) {
          if (i === dates.length - 1 && dates[i] !== today) break;
          const curr = new Date(dates[i]);
          const prev = new Date(dates[i - 1] || dates[i]);
          const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 1) streak++;
          else break;
        }

        setStats({ totalCorrect, accuracy, streak });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user, dateRange.startDate, dateRange.endDate]);

  return { stats, isLoading };
}