import React, { useState, useRef } from 'react';
import { MoreVertical, Plus, FolderPlus } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { AddToProblemSetModal } from './AddToProblemSetModal';

interface QuestionActionsProps {
  questionId: string;
}

export function QuestionActions({ questionId }: QuestionActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddToProblemSetModal, setShowAddToProblemSetModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50"
        aria-label="Question actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setShowAddToProblemSetModal(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FolderPlus className="w-4 h-4" />
              Add to Problem Set
            </button>
          </div>
        </div>
      )}

      <AddToProblemSetModal
        isOpen={showAddToProblemSetModal}
        onClose={() => setShowAddToProblemSetModal(false)}
        questionId={questionId}
      />
    </div>
  );
}