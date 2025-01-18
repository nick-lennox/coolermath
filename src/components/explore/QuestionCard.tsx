import React from 'react';
import { BookOpen, Award, ArrowRight } from 'lucide-react';
import { SubjectBadge } from './SubjectBadge';
import { QuestionActions } from './QuestionActions';
import { useAuth } from '../../contexts/AuthContext';

interface QuestionCardProps {
  id: string;
  title: string;
  subject: string;
  level?: string;
  difficulty: string;
  attempts: number;
  successRate: number;
  onSelect: (id: string) => void;
}

export function QuestionCard({
  id,
  title,
  subject,
  level,
  difficulty,
  attempts,
  successRate,
  onSelect
}: QuestionCardProps) {
  const { user } = useAuth();

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'basic':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-orange-600 bg-orange-50';
      case 'challenge':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-medium text-gray-900 line-clamp-2">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium capitalize flex-shrink-0 ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SubjectBadge subject={subject} level={level} />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{attempts} attempts</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4" />
          <span>{successRate}% success</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onSelect(id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:border-gray-300 hover:text-gray-800 transition-colors`}
        >
          View Question
          <ArrowRight className="w-4 h-4" />
        </button>
        {user && <QuestionActions questionId={id} />}
      </div>
    </div>
  );
}