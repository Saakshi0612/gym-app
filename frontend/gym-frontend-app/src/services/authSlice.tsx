// src/services/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';
import axios from 'axios';

// API base URL - replace with your actual API endpoint
const API_URL = "https://9t23wu6vi5.execute-api.ap-southeast-1.amazonaws.com/dev";

// In-memory storage for users (temporary until backend is implemented)
const users: StoredUser[] = [];

// Initialize users from localStorage
try {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(...storedUsers);
} catch (e) {
  console.error('Error loading users from localStorage:', e);
}

interface StoredUser extends User {
  password: string;
}

// Utility function to remove password from user object
function stripPassword<T extends { password: string }>(user: T): Omit<T, 'password'> {
  // Create a shallow copy of the user object
  const userCopy = { ...user };
  // Remove the password property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = userCopy;
  return rest as Omit<T, 'password'>;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Extract user data from response
      const userData = response.data.user;
      
      // Store tokens in localStorage for future authenticated requests
      if (userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
      }
      if (userData.refreshToken) {
        localStorage.setItem('refreshToken', userData.refreshToken);
      }
      
      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error messages from the API
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      // Generic error message
      return rejectWithValue("We couldn't log you in. Double-check your credentials and try again.");
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
        target: userData.target || '',
        activity: userData.activity || ''
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, registerPayload);
      
      return response.data.user;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error messages from the API
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      // Generic error message
      return rejectWithValue("Registration failed. Please try again later.");
    }
  }
);

// Keep the original updateUserProfile function
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updatedUser: User, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      const index = users.findIndex(client => client.email === currentUser.email);

      if (index === -1) {
        return rejectWithValue('User not found.');
      }

      // Update user profile in the list, preserving the password
      const updatedStoredUser = { ...updatedUser, password: users[index].password };
      users[index] = updatedStoredUser;
      
      // Update localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const storedIndex = storedUsers.findIndex((u: User) => u.email === currentUser.email);
        if (storedIndex !== -1) {
          storedUsers[storedIndex] = updatedStoredUser;
          localStorage.setItem('users', JSON.stringify(storedUsers));
        }
      } catch (e) {
        console.error('Error updating localStorage:', e);
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return rejectWithValue('Failed to update user profile.');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      // Find user in the local storage
      const index = users.findIndex(user => user.email === currentUser.email);
      
      if (index === -1) {
        return rejectWithValue('User not found.');
      }

      // Verify old password
      if (users[index].password !== oldPassword) {
        return rejectWithValue('Current password is incorrect.');
      }

      // Check if new password is same as old password
      if (oldPassword === newPassword) {
        return rejectWithValue('New password must be different from current password.');
      }

      // Update password
      users[index].password = newPassword;

      // Update localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const storedIndex = storedUsers.findIndex((u: StoredUser) => u.email === currentUser.email);
        if (storedIndex !== -1) {
          storedUsers[storedIndex].password = newPassword;
          localStorage.setItem('users', JSON.stringify(storedUsers));
        }
      } catch (e) {
        console.error('Error updating localStorage:', e);
        return rejectWithValue('Failed to save password.');
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error("Error updating password:", error);
      return rejectWithValue('Failed to update password.');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;