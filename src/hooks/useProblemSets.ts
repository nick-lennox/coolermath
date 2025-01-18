import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProblemSet } from '../types/problemSet';
import { useAuth } from '../contexts/AuthContext';

export function useProblemSets() {
  const { user } = useAuth();
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localQuestionCounts, setLocalQuestionCounts] = useState<Record<string, number>>({});

  const fetchProblemSets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First get the problem sets
      let query = supabase
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
        .order('created_at', { ascending: false }); // Order by creation date to maintain consistent order

      if (user) {
        query = query.or(`is_public.eq.true,created_by.eq.${user.id}`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data: problemSetsData, error: problemSetsError } = await query;
      if (problemSetsError) throw problemSetsError;

      // Get usernames for created_by
      const userIds = [...new Set(problemSetsData?.map(set => set.created_by) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const usernameMap = (profiles || []).reduce((acc: Record<string, string>, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});

      // Get question counts
      const { data: questionCounts } = await supabase
        .from('problem_set_questions')
        .select('problem_set_id');

      // Calculate base counts from server
      const baseCounts = (questionCounts || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.problem_set_id] = (acc[curr.problem_set_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Transform the data with combined counts
      const transformedData = problemSetsData?.map(set => ({
        ...set,
        created_by: usernameMap[set.created_by] || 'Unknown User',
        question_count: (baseCounts[set.id] || 0) + (localQuestionCounts[set.id] || 0)
      })) || [];

      setProblemSets(transformedData);
      // Reset local counts after a successful fetch
      setLocalQuestionCounts({});
    } catch (err) {
      console.error('Error fetching problem sets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch problem sets');
    } finally {
      setIsLoading(false);
    }
  }, [user, localQuestionCounts]);

  useEffect(() => {
    fetchProblemSets();
  }, [fetchProblemSets]);

  const updateLocalQuestionCount = useCallback((problemSetId: string) => {
    setLocalQuestionCounts(prev => ({
      ...prev,
      [problemSetId]: (prev[problemSetId] || 0) + 1
    }));
  }, []);

  return {
    problemSets,
    isLoading,
    error,
    refetch: fetchProblemSets,
    updateLocalQuestionCount
  };
}