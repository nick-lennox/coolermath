import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProblemSets } from '../../hooks/useProblemSets';
import { addQuestionToProblemSet } from '../../lib/problemSets/addQuestion';

interface AddToProblemSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
}

export function AddToProblemSetModal({ isOpen, onClose, questionId }: AddToProblemSetModalProps) {
  const { user } = useAuth();
  const { problemSets, updateLocalQuestionCount, refetch } = useProblemSets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !user) return null;

  const filteredProblemSets = problemSets.filter(set => 
    set.created_by === user.profile?.username &&
    set.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToProblemSet = async (problemSetId: string) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      // First try to add the question to the problem set
      await addQuestionToProblemSet(problemSetId, questionId);
      
      // Update the local count and trigger a refetch
      updateLocalQuestionCount(problemSetId);
      await refetch();
      
      setSuccess('Question successfully added');
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      if (err instanceof Error && err.message === 'This question is already in the problem set') {
        setError('This question is already in the problem set');
      } else {
        setError('Failed to add question to problem set');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Add to Problem Set</h2>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your problem sets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
            {success}
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredProblemSets.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No problem sets found
            </p>
          ) : (
            filteredProblemSets.map((set) => (
              <button
                key={set.id}
                onClick={() => handleAddToProblemSet(set.id)}
                disabled={isSubmitting}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <h3 className="font-medium text-gray-900">{set.title}</h3>
                <p className="text-sm text-gray-500">
                  {set.question_count} questions
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}