import { supabase } from './supabase';
import { SubjectSelection } from '../types/subjects';

interface SubmissionParams {
  userId?: string;
  selection: SubjectSelection | { testType: 'quiz'; problemSetId?: string };
  submittedAnswer: string;
  isCorrect: boolean;
  questionId: string;
}

export async function recordSubmission({
  userId,
  selection,
  submittedAnswer,
  isCorrect,
  questionId
}: SubmissionParams) {
  try {
    // Get question details first
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('test_type, topic')
      .eq('id', questionId)
      .single();

    if (questionError) throw questionError;

    // If user is not authenticated, just return without recording
    if (!userId) return;

    // Prepare submission data
    const submissionData: Record<string, any> = {
      user_id: userId,
      question_id: questionId,
      submitted_answer: submittedAnswer,
      is_correct: isCorrect,
      test_type: 'testType' in selection ? selection.testType : 'quiz',
      topic: question.topic
    };

    // Only add problem_set_id if it exists and is not undefined
    if ('problemSetId' in selection && selection.problemSetId) {
      submissionData.problem_set_id = selection.problemSetId;
    }

    const { error } = await supabase
      .from('submissions')
      .insert(submissionData);

    if (error) throw error;
  } catch (error) {
    console.error('Error recording submission:', error);
    throw error;
  }
}