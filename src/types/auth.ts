export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string | undefined;
  profile: Profile | null;
}