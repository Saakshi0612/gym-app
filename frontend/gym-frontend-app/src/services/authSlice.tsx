// src/services/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';

interface StoredUser extends User {
  password: string;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedClients = localStorage.getItem('clients') || '[]';
      const clients: StoredUser[] = JSON.parse(storedClients);

      const user = clients.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("We couldn't log you in. Double-check your password and try again.");
      }

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue("We're experiencing technical difficulties. Please try again later.");
    }
  }
);

// Add this to your authSlice.ts
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      const storedClients = localStorage.getItem('clients') || '[]';
      const clients: StoredUser[] = JSON.parse(storedClients);
      const index = clients.findIndex(client => client.email === currentUser.email);

      if (index === -1) {
        return rejectWithValue('User not found in clients list.');
      }

      // Verify old password
      if (clients[index].password !== oldPassword) {
        return rejectWithValue('Old password is incorrect.');
      }

      // Update password
      clients[index].password = newPassword;

      // Update localStorage
      localStorage.setItem('clients', JSON.stringify(clients));
      
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      return rejectWithValue('Failed to update password.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedUsers = localStorage.getItem('clients') || '[]';
      const existingUsers: StoredUser[] = JSON.parse(storedUsers);

      if (existingUsers.some((u) => u.email === userData.email)) {
        return rejectWithValue("Email already exists");
      }

      const coachEmails = ['coach1@example.com', 'coach2@example.com', 'coach3@example.com'];
      const role = coachEmails.includes(userData.email) ? 'coach' : 'client';

      const newUser: StoredUser = { ...userData, role };
      existingUsers.push(newUser);
      localStorage.setItem('clients', JSON.stringify(existingUsers));

      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue("Registration failed. Please try again later.");
    }
  }
);

// Update User Profile Async Thunk
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updatedUser: User, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('No user is logged in.');
      }

      const storedClients = localStorage.getItem('clients') || '[]';
      const clients: StoredUser[] = JSON.parse(storedClients);
      const index = clients.findIndex(client => client.email === currentUser.email);

      if (index === -1) {
        return rejectWithValue('User not found in clients list.');
      }

      // Update user profile in the list
      clients[index] = { ...clients[index], ...updatedUser };

      // Update localStorage and Redux state
      localStorage.setItem('clients', JSON.stringify(clients));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return rejectWithValue('Failed to update user profile.');
    }
  }
);

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
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
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
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
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
