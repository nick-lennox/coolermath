import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProblemSets } from '../hooks/useProblemSets';
import { addQuestionToProblemSet } from '../lib/problemSets/addQuestion';
import { AddToProblemSetModal } from './explore/AddToProblemSetModal';

interface AddToProblemSetButtonProps {
  questionId: string;
}

export function AddToProblemSetButton({ questionId }: AddToProblemSetButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:border-gray-300 transition-colors"
      >
        <FolderPlus className="w-4 h-4" />
        Add to Problem Set
      </button>

      <AddToProblemSetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        questionId={questionId}
      />
    </>
  );
}