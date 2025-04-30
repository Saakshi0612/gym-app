// src/types/auth.types.ts
export interface User {
  id:string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'client' | 'coach' | 'admin';
    target?: string;
    activity?: string;
    phoneNumber?: string;
    title?: string;
    about?: string;
    tags?: string[];
    certificates?: Array<{
      name: string;
      size: string;
      url: string;
    }>;
    rating?: number;
    preferableActivity?: string;
    avatarUrl?: string;
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
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    target?: string;
    activity?: string;
  }

export interface UserNavigationProps {
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  userDetail?: User| null ; // Add null as a possible type
  notification: string;
  profile: string;
  accountIcon: string;
  handleLogout: () => void;
  handleAccountClick: () => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  className?: string;
}