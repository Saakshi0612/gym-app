// src/types/auth.types.ts
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    role: 'client' | 'coach' | 'admin';
    target?: string;
    activity?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    target: string;
    activity: string;
  }