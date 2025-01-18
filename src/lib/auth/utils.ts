import { supabase } from '../supabase';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username);

  if (error) {
    console.error('Username check error:', error);
    throw error;
  }

  return count === 0;
}