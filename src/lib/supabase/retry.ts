import { PostgrestError } from '@supabase/supabase-js';

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delayMs: 1000,
  backoff: true
};

export async function withRetry<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options: RetryOptions = {}
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const { maxRetries, delayMs, backoff } = { ...DEFAULT_OPTIONS, ...options };
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const result = await operation();
      
      // If successful or if it's a "real" error (not a network error)
      if (result.data || (result.error && result.error.code !== 'PGRST600')) {
        return result;
      }

      attempts++;
      
      // If we've exhausted retries, return the result
      if (attempts === maxRetries) {
        return result;
      }

      // Wait before retrying
      const delay = backoff ? delayMs * Math.pow(2, attempts - 1) : delayMs;
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      attempts++;
      if (attempts === maxRetries) {
        return { data: null, error: error as PostgrestError };
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return { data: null, error: null };
}