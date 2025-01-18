import React from 'react';
import { Calculator, Book } from 'lucide-react';
import { TEST_TYPES } from '../../../types/subjects';

interface SubjectBadgeProps {
  testType: string;
  topic?: string;
  problemSet?: {
    title: string;
  };
}

export function SubjectBadge({ testType, topic, problemSet }: SubjectBadgeProps) {
  const Icon = testType === 'quiz' ? Book : Calculator;
  
  let displayText = '';
  if (testType === 'quiz' && problemSet) {
    displayText = `${problemSet.title} • Quiz`;
  } else {
    displayText = TEST_TYPES[testType as keyof typeof TEST_TYPES] || testType;
    if (topic) {
      displayText += ` • ${topic}`;
    }
  }
  
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-sm font-medium">{displayText}</span>
    </div>
  );
}