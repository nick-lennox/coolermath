import React from 'react';
import { Calculator, Atom, TestTube, Landmark, Globe2, BookOpen, Languages } from 'lucide-react';
import { Subject } from '../../types/subjects';

const iconMap = {
  Calculator,
  Atom,
  TestTube,
  Landmark,
  Globe2,
  BookOpen,
  Languages
};

interface SubjectCardProps {
  subject: Subject;
  isSelected: boolean;
  onClick: () => void;
}

export function SubjectCard({ subject, isSelected, onClick }: SubjectCardProps) {
  const Icon = iconMap[subject.icon as keyof typeof iconMap];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isSelected
          ? 'bg-blue-100 border border-blue-500'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
    >
      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
      <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
        {subject.name}
      </span>
    </button>
  );
}