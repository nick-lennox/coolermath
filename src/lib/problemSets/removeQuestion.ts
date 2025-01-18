import { supabase } from '../supabase';

export async function removeQuestionFromProblemSet(problemSetId: string, questionId: string) {
  const { error } = await supabase
    .from('problem_set_questions')
    .delete()
    .eq('problem_set_id', problemSetId)
    .eq('question_id', questionId);

  if (error) throw error;
}