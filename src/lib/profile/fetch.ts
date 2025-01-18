import { supabase } from '../supabase';
import { ProfileFetchOptions, ProfileFetchResult } from './types';

const DEFAULT_OPTIONS: Required<ProfileFetchOptions> = {
  retries: 3,
  retryDelay: 1000
};

export async function fetchProfile(
  userId: string, 
  options: ProfileFetchOptions = {}
): Promise<ProfileFetchResult> {
  const { retries, retryDelay } = { ...DEFAULT_OPTIONS, ...options };
  let attempts = 0;

  while (attempts < retries) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // Use single() instead of maybeSingle() to handle missing profiles better

      if (error) {
        // If the error is "No rows returned", return a not found result
        if (error.code === 'PGRST116') {
          return {
            success: false,
            profile: null,
            error: 'Profile not found'
          };
        }
        throw error;
      }
      
      return {
        success: true,
        profile: data
      };
      
    } catch (error) {
      attempts++;
      
      // If it's the last attempt, return error
      if (attempts === retries) {
        console.error('Profile fetch failed:', error);
        return {
          success: false,
          profile: null,
          error: 'Failed to fetch profile'
        };
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  return {
    success: false,
    profile: null,
    error: 'Maximum retries exceeded'
  };
}