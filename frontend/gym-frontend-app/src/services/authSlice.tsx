// src/services/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';

// Define a type for stored users that includes password
interface StoredUser extends User {
  password: string;
}

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedClients = localStorage.getItem('clients') || '[]';
      const clients: StoredUser[] = JSON.parse(storedClients);
      
      const user = clients.find(u => u.email === credentials.email && u.password === credentials.password);

      if (!user) {
        return rejectWithValue("We couldn't log you in. Double-check your password and try again.");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error: unknown) {
      console.error("Login error:", error);
      return rejectWithValue("We're experiencing technical difficulties. Please try logging in again later.");
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsers = localStorage.getItem('clients') || '[]';
      const existingUsers: StoredUser[] = JSON.parse(storedUsers);

      if (existingUsers.some((u) => u.email === userData.email)) {
        return rejectWithValue("Email already exists");
      }

      // List of coach emails
      const coachEmails = ['coach1@example.com', 'coach2@example.com', 'coach3@example.com'];

      // Assign role based on whether the email is a coach's
      const role = coachEmails.includes(userData.email) ? 'coach' : 'client';

      const newUser: StoredUser = { ...userData, role };
      existingUsers.push(newUser);
      localStorage.setItem('clients', JSON.stringify(existingUsers));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error: unknown) {
      console.error("Registration error:", error);
      return rejectWithValue("Registration failed. Please try again later.");
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
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
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
      // Register cases
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
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;