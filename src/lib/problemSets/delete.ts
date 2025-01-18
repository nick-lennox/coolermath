import { supabase } from '../supabase';

export async function deleteProblemSet(id: string) {
  const { error } = await supabase
    .from('problem_sets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting problem set:', error);
    throw new Error('Failed to delete problem set');
  }
}