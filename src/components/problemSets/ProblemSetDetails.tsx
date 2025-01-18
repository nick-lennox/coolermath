import React, { useState } from 'react';
import { ArrowLeft, Book, User, Clock, Play } from 'lucide-react';
import { useProblemSetDetails } from '../../hooks/useProblemSetDetails';
import { QuestionList } from './QuestionList';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PageContainer } from '../layout/PageContainer';
import { EditableField } from '../ui/EditableField';
import { updateProblemSet } from '../../lib/problemSets/update';
import { useAuth } from '../../contexts/AuthContext';
import { QuizView } from '../quiz/QuizView';

interface ProblemSetDetailsProps {
  problemSetId: string;
  onBack: () => void;
  onQuestionSelect: (questionId: string) => void;
  onNavigateToExplore: () => void;
}

export function ProblemSetDetails({ 
  problemSetId, 
  onBack, 
  onQuestionSelect,
  onNavigateToExplore 
}: ProblemSetDetailsProps) {
  const { user } = useAuth();
  const { problemSet, questions, isLoading, refetch } = useProblemSetDetails(problemSetId);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const isOwner = user?.profile?.username === problemSet?.created_by;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!problemSet) {
    return (
      <div className="text-center py-12 text-gray-500">
        Problem set not found
      </div>
    );
  }

  if (isQuizMode) {
    return (
      <QuizView 
        questions={questions}
        problemSetId={problemSetId}
        onBack={() => setIsQuizMode(false)}
      />
    );
  }

  const handleUpdateTitle = async (newTitle: string) => {
    await updateProblemSet({ id: problemSetId, title: newTitle });
    refetch();
  };

  const handleUpdateDescription = async (newDescription: string) => {
    await updateProblemSet({ id: problemSetId, description: newDescription });
    refetch();
  };

  return (
    <PageContainer>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Problem Sets
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            {isOwner ? (
              <>
                <div className="mb-4">
                  <EditableField 
                    value={problemSet.title} 
                    onSave={handleUpdateTitle}
                    isTitle
                  />
                </div>
                <div className="mb-6">
                  <EditableField 
                    value={problemSet.description || ''} 
                    onSave={handleUpdateDescription}
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{problemSet.title}</h1>
                <p className="text-gray-600 mb-6">{problemSet.description}</p>
              </>
            )}
          </div>

          {questions.length > 0 && (
            <button
              onClick={() => setIsQuizMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            <span>{questions.length} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Created by {problemSet.created_by}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(problemSet.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <QuestionList 
        questions={questions} 
        onQuestionSelect={onQuestionSelect}
        problemSetId={problemSetId}
        createdBy={problemSet.created_by}
        onQuestionRemoved={refetch}
        onNavigateToExplore={onNavigateToExplore}
      />
    </PageContainer>
  );
}