import { useState } from 'react';
import { SubjectSelection } from '../types/subjects';
import { ScoreState } from '../types/score';
import { AppView } from '../types/appState';

const initialScoreState: ScoreState = {
  total: { correct: 0, total: 0 },
  bySubject: {}
};

const initialSubjectSelection: SubjectSelection = {
  testType: 'SAT',
  level: 'all'
};

export function useAppState() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('problems');
  const [subjectSelection, setSubjectSelection] = useState<SubjectSelection>(initialSubjectSelection);
  const [scores, setScores] = useState<ScoreState>(initialScoreState);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  return {
    selectedAnswer,
    setSelectedAnswer,
    showOverlay,
    setShowOverlay,
    currentView,
    setCurrentView,
    subjectSelection,
    setSubjectSelection,
    scores,
    setScores,
    selectedQuestionId,
    setSelectedQuestionId
  };
}