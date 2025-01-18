import { supabase } from '../supabase';
import { AuthResult } from './types';
import { checkUsernameAvailability } from './utils';

export async function signUp({ email, password, username }: { 
  email: string; 
  password: string; 
  username: string; 
}): Promise<AuthResult> {
  try {
    // First check username availability
    const isAvailable = await checkUsernameAvailability(username);
    if (!isAvailable) {
      return { success: false, error: 'Username already taken' };
    }

    // Create the auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username // Store username in user metadata
        }
      }
    });

    if (signUpError || !data.user) {
      return { 
        success: false, 
        error: signUpError?.message || 'Signup failed'
      };
    }

    // Wait a moment for the profile trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the profile with username
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', data.user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't fail the signup if profile update fails
      // The username will be stored in metadata and can be synced later
    }

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}