export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}