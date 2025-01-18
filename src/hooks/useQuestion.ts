import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Question } from '../types/question';
import { SubjectSelection } from '../types/subjects';

export interface QuestionWithId extends Question {
  id: string;
}

export function useQuestion(selection: SubjectSelection, questionId: string | null = null) {
  const [question, setQuestion] = useState<QuestionWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setIsLoading(true);
        setError(null);

        // If no selection is provided, default to SAT Math
        const defaultSelection = {
          testType: 'SAT',
          level: 'algebra'
        };

        const effectiveSelection = selection.testType ? selection : defaultSelection;

        let query = supabase
          .from('questions')
          .select('*');

        if (questionId) {
          // If questionId is provided, fetch that specific question
          query = query.eq('id', questionId);
        } else if (effectiveSelection.testType) {
          // Match test_type exactly
          query = query.eq('test_type', effectiveSelection.testType);
          
          // For SAT/ACT, also match the topic (level) if not 'all'
          if (['SAT', 'ACT'].includes(effectiveSelection.testType) && effectiveSelection.level && effectiveSelection.level !== 'all') {
            query = query.eq('topic', effectiveSelection.level);
          }
        }

        // Limit to 1 and choose randomly if not fetching by ID
        if (!questionId) {
          query = query.limit(1);
        }
        
        const { data, error: queryError } = await query;

        if (queryError) throw queryError;
        if (!data || data.length === 0) {
          setError('No questions available for this selection');
          setQuestion(null);
          return;
        }

        const questionRecord = data[0];

        // Parse options if they're stored as a string
        let parsedOptions = typeof questionRecord.options === 'string' 
          ? JSON.parse(questionRecord.options)
          : questionRecord.options;

        const transformedQuestion: QuestionWithId = {
          id: questionRecord.id,
          question: {
            text: questionRecord.question_text,
            latex: questionRecord.question_latex || undefined,
            imageUrl: questionRecord.question_image_url || undefined
          },
          options: parsedOptions,
          explanation: {
            text: questionRecord.explanation_text,
            latex: questionRecord.explanation_latex || undefined,
            options: parsedOptions
          },
          correctAnswer: questionRecord.correct_answer
        };

        setQuestion(transformedQuestion);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch question');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestion();
  }, [selection, questionId]);

  return { question, isLoading, error };
}