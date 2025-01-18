import React from 'react';
import { Calculator, Atom, TestTube } from 'lucide-react';

interface SubjectBadgeProps {
  subject: string;
  level?: string;
}

export function SubjectBadge({ subject, level }: SubjectBadgeProps) {
  const getSubjectIcon = () => {
    switch (subject.toLowerCase()) {
      case 'math': return Calculator;
      case 'physics': return Atom;
      case 'chemistry': return TestTube;
      default: return Calculator;
    }
  };

  const Icon = getSubjectIcon();

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
      <Icon className="w-3 h-3" />
      <span>{subject}</span>
      {level && <span className="text-gray-500">Level {level}</span>}
    </div>
  );
}