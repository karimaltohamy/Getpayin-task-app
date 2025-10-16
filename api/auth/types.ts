export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null; // accessToken for API requests
  refreshToken: string | null; // refreshToken to get new accessToken
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
