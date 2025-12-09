export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

export interface AuthResponse {
  id: string;
  user: User;
  accessToken: string;
}

export interface AuthError {
  message: string;
}
