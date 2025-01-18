import { supabase } from './supabase';
import { Profile } from '../types/auth';
import { ProfileError } from './errors';

const PROFILE_FETCH_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  let attempts = 0;
  
  while (attempts < PROFILE_FETCH_RETRIES) {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      // If we got data, return it
      if (data) return data;
      
      // If no data and not first attempt, wait before retry
      if (attempts > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
      
      attempts++;
    } catch (error) {
      console.error('Profile fetch attempt failed:', error);
      if (attempts === PROFILE_FETCH_RETRIES - 1) {
        throw new ProfileError('Failed to fetch user profile', error as Error);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      attempts++;
    }
  }
  
  return null;
}