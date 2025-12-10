export interface User {
  _id: string;
  fullName: string;
  email: string;
  businessName?: string | null;
  address?: string | null;
  phone?: string | null;
  profileImageUrl?: string | null;
}

export interface AuthResponse {
  id: string;
  user: User;
  accessToken: string;
}

export interface AuthError {
  message: string;
}
