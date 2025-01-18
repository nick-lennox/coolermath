import { supabase } from '../supabase';

export async function toggleProblemSetPublic(id: string, isPublic: boolean) {
  const { data, error } = await supabase
    .from('problem_sets')
    .update({ 
      is_public: isPublic,
      // Only update the timestamp, don't use it for ordering
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating problem set:', error);
    throw new Error('Failed to update problem set visibility');
  }

  return data;
}