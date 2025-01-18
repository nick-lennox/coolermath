import { supabase } from '../supabase';

interface CreateProblemSetParams {
  title: string;
  description?: string;
  isPublic: boolean;
  createdBy: string;
}

export async function createProblemSet({
  title,
  description,
  isPublic,
  createdBy
}: CreateProblemSetParams) {
  const { data, error } = await supabase
    .from('problem_sets')
    .insert({
      title,
      description,
      is_public: isPublic,
      created_by: createdBy
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}