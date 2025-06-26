// User role enum (matching backend)
export enum UserRole {
  OWNER = 'OWNER',
  SITTER = 'SITTER',
  VET = 'VET',
}

// User interface matching backend model
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  displayName?: string;
  profileImage?: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth response type
export interface AuthResponse {
  user: User;
  token?: string;
}

// Sign up data
export interface SignupData {
  name: string;
  email: string;
  password: string;
  username: string; // Now required
  displayName?: string;
  role: UserRole | string;
  phone?: string;
  location?: string;
}

// Login data
export interface LoginData {
  username: string;
  password: string;
}
