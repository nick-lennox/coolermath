export interface ProfileFetchOptions {
  retries?: number;
  retryDelay?: number;
}

export interface ProfileFetchResult {
  success: boolean;
  profile: {
    id: string;
    username: string;
    created_at: string;
    updated_at: string;
  } | null;
  error?: string;
}