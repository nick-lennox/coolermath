import React from 'react';
import { ProblemSet } from '../../types/problemSet';
import { ProblemSetCard } from './ProblemSetCard';
import { Loader2, BookX } from 'lucide-react';
import { toggleProblemSetPublic } from '../../lib/problemSets/togglePublic';
import { deleteProblemSet } from '../../lib/problemSets/delete';
import { useAuth } from '../../contexts/AuthContext';

interface ProblemSetsListProps {
  problemSets: ProblemSet[];
  isLoading: boolean;
  onProblemSetSelect: (id: string) => void;
  emptyMessage?: React.ReactNode;
  refetch: () => void;
}

export function ProblemSetsList({ 
  problemSets, 
  isLoading, 
  onProblemSetSelect,
  emptyMessage,
  refetch
}: ProblemSetsListProps) {
  const { user } = useAuth();

  const handleTogglePublic = async (problemSet: ProblemSet) => {
    if (!user) return;

    try {
      await toggleProblemSetPublic(problemSet.id, !problemSet.is_public);
      refetch();
    } catch (error) {
      console.error('Error toggling problem set visibility:', error);
      alert('Failed to update problem set visibility. Please try again.');
    }
  };

  const handleDelete = async (problemSet: ProblemSet) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this problem set? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProblemSet(problemSet.id);
      refetch();
    } catch (error) {
      console.error('Error deleting problem set:', error);
      alert('Failed to delete problem set. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (problemSets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookX className="w-12 h-12 mx-auto mb-4" />
        {emptyMessage || <p>No problem sets found.</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {problemSets.map((problemSet) => (
        <ProblemSetCard 
          key={problemSet.id} 
          problemSet={problemSet}
          onClick={() => onProblemSetSelect(problemSet.id)}
          onTogglePublic={() => handleTogglePublic(problemSet)}
          onDelete={() => handleDelete(problemSet)}
        />
      ))}
    </div>
  );
}