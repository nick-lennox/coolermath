import { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseError(error: PostgrestError | null): string {
  if (!error) return 'An unexpected error occurred';

  switch (error.code) {
    case 'PGRST600':
      return 'Unable to connect to the server. Please check your internet connection.';
    case '23505':
      return 'This record already exists.';
    case '23503':
      return 'This operation cannot be completed because the record is being used.';
    case '42P01':
      return 'The requested resource was not found.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}