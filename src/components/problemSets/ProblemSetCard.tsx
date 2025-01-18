import React, { useState, useRef } from 'react';
import { Book, Clock, User, MoreVertical, Globe, Lock, Trash2 } from 'lucide-react';
import { ProblemSet } from '../../types/problemSet';
import { useAuth } from '../../contexts/AuthContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface ProblemSetCardProps {
  problemSet: ProblemSet;
  onClick: () => void;
  onDelete?: () => void;
  onTogglePublic?: () => void;
}

export function ProblemSetCard({ 
  problemSet, 
  onClick,
  onDelete,
  onTogglePublic 
}: ProblemSetCardProps) {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const formattedDate = new Date(problemSet.created_at).toLocaleDateString();
  const isOwner = user?.profile?.username === problemSet.created_by;

  useOnClickOutside(actionsRef, () => setShowActions(false));

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowActions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button
          onClick={onClick}
          className="flex-1 text-left"
        >
          <h3 className="font-medium text-gray-900 line-clamp-2">{problemSet.title}</h3>
        </button>
        
        {isOwner && (
          <div className="relative" ref={actionsRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {onTogglePublic && (
                    <button
                      onClick={(e) => handleActionClick(e, onTogglePublic)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {problemSet.is_public ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Set to Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Set to Public
                        </>
                      )}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => handleActionClick(e, onDelete)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onClick}
        className="w-full text-left"
      >
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {problemSet.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4" />
            <span>{problemSet.question_count} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Created by {problemSet.created_by}</span>
          <div className="ml-auto flex items-center gap-2">
            {problemSet.is_public ? (
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                Public
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                Private
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}