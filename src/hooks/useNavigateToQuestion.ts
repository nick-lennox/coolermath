import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateToQuestion() {
  const navigate = useNavigate();

  const navigateToQuestion = useCallback((
    questionId: string,
    onQuestionSelect: (id: string) => void
  ) => {
    // First select the question
    onQuestionSelect(questionId);
    
    // Then navigate to the problems page
    navigate('/');
  }, [navigate]);

  return { navigateToQuestion };
}