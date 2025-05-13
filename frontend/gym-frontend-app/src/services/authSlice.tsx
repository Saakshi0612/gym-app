/* eslint-disable */
// @ts-nocheck
// src/services/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';
import { api, API_BASE_URL } from './api';
import axios from 'axios';

// Helper function to persist auth state
const persistAuthState = (user: User | null, isAuthenticated: boolean) => {
  if (isAuthenticated && user) {
    // Create a copy of the user without sensitive data for localStorage
    const userForStorage = { ...user };
    
    // Store tokens separately if they exist in the user object
    if (userForStorage.accessToken) {
      localStorage.setItem('accessToken', userForStorage.accessToken);
      console.log('Access token stored during persist');
      // Remove from the storage object to avoid duplication
      delete userForStorage.accessToken;
    }
    
    if (userForStorage.refreshToken) {
      localStorage.setItem('refreshToken', userForStorage.refreshToken);
      console.log('Refresh token stored during persist');
      // Remove from the storage object to avoid duplication
      delete userForStorage.refreshToken;
    }
    
    localStorage.setItem('authUser', JSON.stringify(userForStorage));
    localStorage.setItem('isAuthenticated', 'true');
  } else {
    localStorage.removeItem('authUser');
    localStorage.removeItem('isAuthenticated');
  }
};

// Helper function to load auth state
const loadAuthState = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const authUser = localStorage.getItem('authUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const accessToken = localStorage.getItem('accessToken');

    // Only consider authenticated if we have both user data and a token
    if (authUser && isAuthenticated && accessToken) {
      return {
        user: JSON.parse(authUser),
        isAuthenticated: true,
      };
    }
    return { user: null, isAuthenticated: false };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return { user: null, isAuthenticated: false };
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email: credentials.email, password: '***REDACTED***' });
      
      // Use the API gateway endpoint
      const response = await api.post(`/api/auth/login`, credentials);
      
      console.log('Login response:', response.data);

      // Extract user data and tokens from response
      const userData = response.data.user;
      
      // Store tokens in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log('Access token stored in localStorage:', response.data.accessToken.substring(0, 10) + '...');
      } else {
        console.error('No access token received from server');
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
        console.log('Refresh token stored in localStorage');
      } else {
        console.error('No refresh token received from server');
      }

      // Normalize role to lowercase if needed
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }

      return userData;
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error messages from the API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      // Generic error message
      return rejectWithValue(
        "We couldn't log you in. Double-check your credentials and try again."
      );
    }
  }
);

// Debug function to check token status
export const checkTokenStatus = createAsyncThunk(
  'auth/checkTokenStatus',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('Token status check:', {
        hasAccessToken: !!accessToken,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : null,
        hasRefreshToken: !!refreshToken,
      });
      
      return { 
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      };
    } catch (error) {
      console.error('Error checking token status:', error);
      return rejectWithValue('Error checking token status');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Format the data according to your API requirements
      const registerPayload = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        target: userData.targets,
        preferableActivity: userData.preferableActivity,
      };

      console.log('Sending registration data:', {
        ...registerPayload,
        password: '***REDACTED***',
        confirmPassword: '***REDACTED***'
      });

      // Use the API gateway endpoint
      const response = await api.post(`/api/auth/register`, registerPayload);
      
      console.log('Registration response:', response.data);

      // Return success message or user data if available
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle validation errors array
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors.join('\n'));
      } 
      // Handle single error message
      else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      // Generic error message
      return rejectWithValue('Registration failed. Please try again later.');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updatedUser: User, { getState, rejectWithValue, dispatch }) => {
    try {
      console.log('Updating user profile:', {
        ...updatedUser,
        // Don't log sensitive fields if present
        password: updatedUser.password ? '***REDACTED***' : undefined,
      });

      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      // Check token status before making the request
      await dispatch(checkTokenStatus());

      // Verify we have an access token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found for authenticated user');
        return rejectWithValue('Authentication error. Please log in again.');
      }

      // Prepare the update payload based on user role
      const updatePayload: any = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      };
      
      if (updatedUser.avatarUrl) {
        updatePayload.avatarUrl = updatedUser.avatarUrl;
      }

      // Add role-specific fields
      if (updatedUser.role?.toLowerCase() === 'admin' && updatedUser.phoneNumber) {
        updatePayload.phoneNumber = updatedUser.phoneNumber;
      } else if (updatedUser.role?.toLowerCase() === 'coach') {
        if (updatedUser.title) updatePayload.title = updatedUser.title;
        if (updatedUser.about) updatePayload.about = updatedUser.about;
        if (updatedUser.tags) updatePayload.tags = updatedUser.tags;
        if (updatedUser.certificates) updatePayload.certificates = updatedUser.certificates;
        if (updatedUser.rating !== undefined) updatePayload.rating = updatedUser.rating;
      } else if (updatedUser.role?.toLowerCase() === 'client') {
        if (updatedUser.preferableActivity) updatePayload.preferableActivity = updatedUser.preferableActivity;
        if (updatedUser.target) updatePayload.target = updatedUser.target;
      }

      // Call the backend API to update the user profile
      const userId = currentUser.id || 'me';
      console.log(`Making PUT request to /api/users/${userId} with auth token:`, accessToken.substring(0, 10) + '...');
      
      const response = await api.put(`/api/users/${userId}`, updatePayload);

      console.log('Profile update response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }

      // Return the updated user data from the response
      const updatedUserData = response.data.user;
      
      // Make sure the role is normalized to lowercase for frontend consistency
      if (updatedUserData.role) {
        updatedUserData.role = updatedUserData.role.toLowerCase();
      }

      return updatedUserData;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      
      // Handle specific error messages from the API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue(error.message || 'Failed to update user profile.');
    }
  }
);

// Updated updatePassword function with backend integration
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { getState, rejectWithValue }
  ) => {
    try {
      console.log('Attempting to update password');
      
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      // Verify we have an access token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found for authenticated user');
        return rejectWithValue('Authentication error. Please log in again.');
      }

      // Call the backend API to update the password
      const userId = currentUser.id || 'me';
      console.log(`Making PUT request to /api/users/${userId}/password with auth token`);
      
      const response = await api.put(`/api/users/${userId}/password`, {
        currentPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Password update response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update password');
      }

      return { message: response.data.message || 'Password updated successfully' };
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      // Handle specific error messages from the API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue(error.message || 'Failed to update password.');
    }
  }
);

// Add a function to get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/api/users/${userId}` : '/api/users/me';
      
      // Verify we have an access token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found for authenticated user');
        return rejectWithValue('Authentication error. Please log in again.');
      }
      
      console.log(`Making GET request to ${endpoint} with auth token`);
      
      const response = await api.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('Get user profile response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
      
      const userData = response.data.user;
      
      // Normalize role to lowercase for frontend consistency
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Add a function to test authentication
export const testAuthentication = createAsyncThunk(
  'auth/testAuth',
  async (_, { rejectWithValue }) => {
    try {
      // This should be a protected endpoint in your API
      const response = await api.get('/api/test-auth');
      console.log('Authentication test successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Authentication test failed:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Authentication test failed'
      );
    }
  }
);

// Load initial state from localStorage
const savedAuthState = loadAuthState();

const initialState: AuthState = {
  user: savedAuthState.user,
  isAuthenticated: savedAuthState.isAuthenticated,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
  state.isAuthenticated = true;
  state.user = action.payload;
  state.error = null;
  
  // Store tokens from user object if available
  if (action.payload.accessToken) {
    localStorage.setItem('accessToken', action.payload.accessToken);
    console.log('Access token stored from user object');
  }
  if (action.payload.refreshToken) {
    localStorage.setItem('refreshToken', action.payload.refreshToken);
    console.log('Refresh token stored from user object');
  }
  
  // Persist the state
  persistAuthState(action.payload, true);
},
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear tokens and auth state from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      persistAuthState(null, false);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        // Persist the state
        persistAuthState(action.payload, true);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Don't set isAuthenticated to true after registration
        // User should log in after registration
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        // Persist the updated user
        persistAuthState(action.payload, true);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // Persist the updated user
        persistAuthState(action.payload, true);
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(testAuthentication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(testAuthentication.fulfilled, (state) => {
        state.isLoading = false;
        // Authentication test successful, no need to update state
      })
      .addCase(testAuthentication.rejected, (state) => {
        state.isLoading = false;
        // Authentication test failed, but we don't want to show an error
        // as this is just a test endpoint
      });
  },
});

// Create a function to check auth status on app load
export const checkAuthStatus = (dispatch: any) => {
  console.log('Checking authentication status...');
  
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const savedState = loadAuthState();
  
  console.log('Auth state from localStorage:', {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    isAuthenticated: savedState.isAuthenticated,
    hasUser: !!savedState.user
  });

  if (!token || !savedState.user) {
    console.log('No token or user found, logging out');
    dispatch(logout());
    return;
  }

  try {
    // For now, just use the saved user data
    console.log('Restoring authenticated session for user:', savedState.user.email);
    dispatch(login(savedState.user));
    
    // Fetch the latest user profile from the server
    dispatch(getUserProfile())
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          console.log('Successfully fetched updated user profile');
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile during auth check:', error);
      });
  } catch (error) {
    console.error('Error in checkAuthStatus:', error);
    dispatch(logout());
  }
};

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;