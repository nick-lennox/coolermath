import { SignUpData } from './types';

export function validateSignUpData(data: SignUpData): string | null {
  if (!data.username || data.username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  
  if (!data.email || !data.email.includes('@')) {
    return 'Please enter a valid email address';
  }
  
  if (!data.password || data.password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
}