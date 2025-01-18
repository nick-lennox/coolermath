import { supabase } from '../supabase';
import { ExploreQuestion } from '../../types/explore';

export async function fetchQuestionStats(questions: ExploreQuestion[]): Promise<ExploreQuestion[]> {
  const questionIds = questions.map(q => q.id);

  // Fetch submission stats
  const { data: statsData, error: statsError } = await supabase
    .from('submissions')
    .select('question_id, is_correct')
    .in('question_id', questionIds);

  if (statsError) throw statsError;

  // Calculate stats for each question
  const statsMap = (statsData || []).reduce((acc: Record<string, { attempts: number, correct: number }>, submission) => {
    if (!acc[submission.question_id]) {
      acc[submission.question_id] = { attempts: 0, correct: 0 };
    }
    acc[submission.question_id].attempts++;
    if (submission.is_correct) {
      acc[submission.question_id].correct++;
    }
    return acc;
  }, {});

  // Update questions with their stats
  return questions.map(q => {
    const stats = statsMap[q.id] || { attempts: 0, correct: 0 };
    return {
      ...q,
      attempts: stats.attempts,
      successRate: stats.attempts > 0 
        ? Math.round((stats.correct / stats.attempts) * 100) 
        : 0
    };
  });
}