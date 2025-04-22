// src/services/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';

interface StoredUser extends User {
  password: string;
}

// In-memory storage for users (temporary until backend is implemented)
const users: StoredUser[] = [];

// Initialize users from localStorage
try {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(...storedUsers);
} catch (e) {
  console.error('Error loading users from localStorage:', e);
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("We couldn't log you in. Double-check your credentials and try again.");
      }

      // Use utility function to remove password
      return stripPassword(user);
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue("We're experiencing technical difficulties. Please try again later.");
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (users.some((u) => u.email === userData.email)) {
        return rejectWithValue("Email already exists");
      }

      const coachEmails = ['coach1@example.com', 'coach2@example.com', 'coach3@example.com'];
      const role = coachEmails.includes(userData.email) ? 'coach' : 'client';

      const newUser: StoredUser = { 
        ...userData, 
        role,
        // Add default values for role-specific properties
        phoneNumber: '',
        title: '',
        about: '',
        tags: [],
        certificates: [],
        rating: 0,
        // Store the activity and target from registration for clients
        preferableActivity: role === 'client' ? userData.activity || '' : '',
        target: role === 'client' ? userData.target || '' : '',
        avatarUrl: 'https://t4.ftcdn.net/jpg/02/62/46/55/240_F_262465578_xxIWQunF7zDbFpJDzSiYWJBwzMzPuEFh.jpg'
      };
      
      users.push(newUser);
      
      // Save to localStorage for persistence
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }

      // Use utility function to remove password
      return stripPassword(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue("Registration failed. Please try again later.");
    }
  }
);

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

      const userIndex = users.findIndex(user => user.email === currentUser.email);

      if (userIndex === -1) {
        return rejectWithValue('User not found.');
      }

      if (users[userIndex].password !== oldPassword) {
        return rejectWithValue('Current password is incorrect.');
      }

      // Update the password
      users[userIndex].password = newPassword;
      
      // Update localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const storedIndex = storedUsers.findIndex((u: User) => u.email === currentUser.email);
        if (storedIndex !== -1) {
          storedUsers[storedIndex].password = newPassword;
          localStorage.setItem('users', JSON.stringify(storedUsers));
        }
      } catch (e) {
        console.error('Error updating password in localStorage:', e);
      }

      return currentUser;
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
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