import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Question } from './components/Question';
import { Scratchpad } from './components/Scratchpad';
import { AnswerOverlay } from './components/AnswerOverlay';
import { SubjectSelector } from './components/SubjectSelector';
import { ScoreTracker } from './components/ScoreTracker';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ExplorePage } from './components/explore/ExplorePage';
import { ProblemSetsPage } from './components/problemSets/ProblemSetsPage';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './contexts/AuthContext';
import { useQuestion } from './hooks/useQuestion';
import { recordSubmission } from './lib/submissions';

export default function App() {
  const { user } = useAuth();
  const {
    selectedAnswer,
    setSelectedAnswer,
    showOverlay,
    setShowOverlay,
    subjectSelection,
    setSubjectSelection,
    scores,
    setScores,
    selectedQuestionId,
    setSelectedQuestionId
  } = useAppState();
  
  const { question, isLoading, error } = useQuestion(subjectSelection, selectedQuestionId);

  const handleSubmit = async () => {
    if (!selectedAnswer || !question) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setShowOverlay(true);
    
    setScores(prev => {
      const newTotal = {
        correct: prev.total.correct + (isCorrect ? 1 : 0),
        total: prev.total.total + 1
      };
      
      const prevSubjectScore = prev.bySubject[subjectSelection.testType] || { correct: 0, total: 0 };
      const newSubjectScore = {
        correct: prevSubjectScore.correct + (isCorrect ? 1 : 0),
        total: prevSubjectScore.total + 1
      };

      return {
        total: newTotal,
        bySubject: {
          ...prev.bySubject,
          [subjectSelection.testType]: newSubjectScore
        }
      };
    });

    try {
      await recordSubmission({
        userId: user?.id,
        selection: subjectSelection,
        submittedAnswer: selectedAnswer,
        isCorrect,
        questionId: question.id
      });
    } catch (error) {
      console.error('Failed to record submission:', error);
    }
  };

  const handleNext = () => {
    setShowOverlay(false);
    setSelectedAnswer(null);
    setSelectedQuestionId(null);
  };

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <>
              <SubjectSelector
                selection={subjectSelection}
                onSelectionChange={setSubjectSelection}
              />
              <main className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
                <Question
                  question={question?.question}
                  options={question?.options || []}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={setSelectedAnswer}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                  questionId={question?.id}
                />
                <Scratchpad />
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
          } />
          <Route path="/explore" element={<ExplorePage onQuestionSelect={handleQuestionSelect} />} />
          <Route path="/problem-sets" element={<ProblemSetsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/settings" element={
            user ? <SettingsPage /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}