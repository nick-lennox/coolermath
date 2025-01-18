import { supabase } from '../supabase';

export async function addQuestionToProblemSet(problemSetId: string, questionId: string) {
  try {
    // Check if question already exists in the problem set
    const { data: existingQuestions, error: checkError } = await supabase
      .from('problem_set_questions')
      .select('id')
      .eq('problem_set_id', problemSetId)
      .eq('question_id', questionId);

    if (checkError) throw checkError;

    if (existingQuestions && existingQuestions.length > 0) {
      throw new Error('This question is already in the problem set');
    }

    // Get the current highest order number
    const { data: orderData, error: orderError } = await supabase
      .from('problem_set_questions')
      .select('order')
      .eq('problem_set_id', problemSetId)
      .order('order', { ascending: false })
      .limit(1);

    if (orderError) throw orderError;

    const nextOrder = orderData && orderData.length > 0 ? orderData[0].order + 1 : 1;

    // Add the question to the problem set
    const { error } = await supabase
      .from('problem_set_questions')
      .insert({
        problem_set_id: problemSetId,
        question_id: questionId,
        order: nextOrder
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('This question is already in the problem set');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add question to problem set');
  }
}