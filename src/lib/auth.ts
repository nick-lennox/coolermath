import { supabase } from './supabase';
import { AuthError } from './errors';

export async function signUp(email: string, password: string, username: string): Promise<void> {
  // Check username availability
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username);

  if (count && count > 0) {
    throw new AuthError('Username already taken');
  }

  // Create user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) throw new AuthError(signUpError.message);
  if (!data.user) throw new AuthError('Signup failed');

  try {
    // Update profile with username
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', data.user.id);

    if (updateError) throw updateError;
  } catch (error) {
    // Cleanup on failure
    await supabase.auth.signOut();
    throw new AuthError('Failed to create profile');
  }
}