/* eslint-disable */
// @ts-nocheck
// src/services/authService.ts
import { checkAuthStatus } from './authSlice';

// Function to initialize auth state when the app starts
export const initializeAuth = (dispatch: any) => {
  checkAuthStatus(dispatch);
};