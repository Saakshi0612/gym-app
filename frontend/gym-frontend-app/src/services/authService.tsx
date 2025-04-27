// src/services/authService.ts
import { checkAuthStatus } from './authSlice';
import { store } from '../store/store';

// Function to initialize auth state when the app starts
export const initializeAuth = () => {
  checkAuthStatus(store.dispatch);
};