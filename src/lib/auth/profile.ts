import { supabase } from '../supabase';
import { ProfileError } from '../errors';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

export async function ensureProfileCreated(userId: string): Promise<void> {
  let attempts = 0;
  
  while (attempts < MAX_RETRIES) {
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (existingProfile) {
        return; // Profile exists, we're good
      }
      
      // If no profile, try to create one
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId }]);
      
      if (!insertError) {
        return; // Profile created successfully
      }
      
      // If error is not a duplicate key error, throw it
      if (!insertError.message.includes('duplicate key')) {
        throw insertError;
      }
      
      // If duplicate key error, profile was created by trigger, we're good
      return;
      
    } catch (error) {
      attempts++;
      if (attempts === MAX_RETRIES) {
        throw new ProfileError('Failed to create or verify profile');
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}