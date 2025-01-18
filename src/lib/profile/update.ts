import { supabase } from '../supabase';

interface ProfileUpdateData {
  username?: string;
  // Add other profile fields as needed
}

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
}