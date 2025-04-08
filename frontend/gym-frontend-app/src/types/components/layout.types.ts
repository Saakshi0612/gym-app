import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  systemError: ReactNode | null;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}