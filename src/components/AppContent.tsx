import React from 'react';
import { Question } from './Question';
import { Scratchpad, ScratchpadRef } from './Scratchpad';
import { AnswerOverlay } from './AnswerOverlay';
import { SubjectSelector } from './SubjectSelector';
import { ScoreTracker } from './ScoreTracker';
import { ProfileDashboard } from './profile/ProfileDashboard';
import { SettingsPage } from './settings/SettingsPage';
import { ExplorePage } from './explore/ExplorePage';
import { SubjectSelection } from '../types/subjects';
import { ScoreState } from '../types/score';
import { Question as QuestionType } from '../types/question';

interface RenderContentProps {
  currentView: 'problems' | 'explore' | 'profile' | 'settings';
  question: QuestionType | null;
  isLoading: boolean;
  error: string | null;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
  handleSubmit: () => void;
  showOverlay: boolean;
  handleNext: () => void;
  subjectSelection: SubjectSelection;
  setSubjectSelection: (selection: SubjectSelection) => void;
  scores: ScoreState;
  scratchpadRef: React.RefObject<ScratchpadRef>;
  onQuestionSelect: (id: string) => void;
}

export function renderContent({
  currentView,
  question,
  isLoading,
  error,
  selectedAnswer,
  setSelectedAnswer,
  handleSubmit,
  showOverlay,
  handleNext,
  subjectSelection,
  setSubjectSelection,
  scores,
  scratchpadRef,
  onQuestionSelect
}: RenderContentProps) {
  switch (currentView) {
    case 'settings':
      return <SettingsPage />;
    case 'profile':
      return <ProfileDashboard />;
    case 'explore':
      return <ExplorePage onQuestionSelect={onQuestionSelect} />;
    default:
      return (
        <>
          <SubjectSelector
            selection={subjectSelection}
            onSelectionChange={setSubjectSelection}
          />
          <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
            <Question
              question={question?.question}
              options={question?.options || []}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
            <Scratchpad ref={scratchpadRef} />
          </main>
          {question && (
            <AnswerOverlay
              isVisible={showOverlay}
              selectedAnswer={selectedAnswer || ''}
              correctAnswer={question.correctAnswer}
              explanation={question.explanation}
              onNext={handleNext}
            />
          )}
          <ScoreTracker scores={scores} />
        </>
      );
  }
}