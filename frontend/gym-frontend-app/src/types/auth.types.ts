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

export interface UserNavigationProps {
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  userDetail?: {
    role?: string;
    [key: string]: unknown; 
  };
  notification: string;
  profile: string;
  accountIcon: string;
  handleLogout: () => void;
  handleAccountClick: () => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  className?: string;
}