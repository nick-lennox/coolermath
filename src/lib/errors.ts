export class AuthError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ProfileError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ProfileError';
  }
}