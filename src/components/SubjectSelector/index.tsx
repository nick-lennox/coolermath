import React from 'react';
import { useSubjects } from '../../hooks/useSubjects';
import { SubjectCard } from './SubjectCard';
import { OptionSelector } from './OptionSelector';
import { SubjectSelection, MathLevel } from '../../types/subjects';
import { Loader2 } from 'lucide-react';

interface SubjectSelectorProps {
  selection: SubjectSelection;
  onSelectionChange: (selection: SubjectSelection) => void;
}

const mathLevels: MathLevel[] = ['algebra', 'geometry', 'trigonometry', 'precalculus', 'calculus'];

export function SubjectSelector({ selection, onSelectionChange }: SubjectSelectorProps) {
  const { subjects, isLoading, error } = useSubjects();

  const handleSubjectClick = (testType: string) => {
    onSelectionChange({
      testType: testType as any,
      level: ['SAT', 'ACT'].includes(testType) ? selection.level || 'algebra' : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              isSelected={selection.testType === subject.id}
              onClick={() => handleSubjectClick(subject.id)}
            />
          ))}
        </div>

        {['SAT', 'ACT'].includes(selection.testType) && (
          <OptionSelector
            options={mathLevels}
            selectedOption={selection.level}
            onChange={(level) => onSelectionChange({ ...selection, level: level as MathLevel })}
          />
        )}
      </div>
    </div>
  );
}