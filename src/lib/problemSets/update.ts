import { supabase } from '../supabase';

interface UpdateProblemSetParams {
  id: string;
  title?: string;
  description?: string;
}

export async function updateProblemSet({ id, title, description }: UpdateProblemSetParams) {
  const updates: Record<string, any> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('problem_sets')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}