// src/services/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types';
import axios from 'axios';

// API base URL - replace with your actual API endpoint
const API_URL: string =
	import.meta.env.VITE_API_URL ||
	'https://p3kuc80q67.execute-api.ap-southeast-1.amazonaws.com/dev';

// Helper function to persist auth state
const persistAuthState = (user: User | null, isAuthenticated: boolean) => {
	if (isAuthenticated && user) {
		localStorage.setItem('authUser', JSON.stringify(user));
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

		return {
			user: authUser ? JSON.parse(authUser) : null,
			isAuthenticated: isAuthenticated,
		};
	} catch (error) {
		console.error('Error loading auth state:', error);
		return { user: null, isAuthenticated: false };
	}
};

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
function stripPassword<T extends { password: string }>(
	user: T
): Omit<T, 'password'> {
	// Create a shallow copy of the user object
	const userCopy = { ...user };
	// Remove the password property
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...rest } = userCopy;
	return rest as Omit<T, 'password'>;
}

// Configure axios instance with interceptors
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for adding token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials: LoginCredentials, { rejectWithValue }) => {
		try {
			const response = await api.post(`/auth/login`, credentials);

			// Extract user data from response
			const userData = response.data.user;

			// Store tokens in localStorage for future authenticated requests
			if (userData.accessToken) {
				localStorage.setItem('accessToken', userData.accessToken);
			}
			if (userData.refreshToken) {
				localStorage.setItem('refreshToken', userData.refreshToken);
			}

			// Normalize role to lowercase if needed
			if (userData.role) {
				userData.role = userData.role.toLowerCase();
			}

			return userData;
		} catch (error: any) {
			console.error('Login error:', error);

			// Handle specific error messages from the API
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				return rejectWithValue(error.response.data.message);
			}

			// Generic error message
			return rejectWithValue(
				"We couldn't log you in. Double-check your credentials and try again."
			);
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
				target: userData.targets || '',
				activity: userData.preferableActivity || '',
			};

			const response = await api.post(`/auth/register`, registerPayload);

			return response.data.user;
		} catch (error: any) {
			console.error('Registration error:', error);

			// Handle specific error messages from the API
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				return rejectWithValue(error.response.data.message);
			}

			// Generic error message
			return rejectWithValue('Registration failed. Please try again later.');
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

      // Prepare the update payload based on user role
      const updatePayload: Record<string, unknown> = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      };

      // Add role-specific fields - handle case sensitivity
      if (currentUser.role.toLowerCase() === 'client') {
        updatePayload.preferableActivity = updatedUser.preferableActivity;
        updatePayload.target = updatedUser.target;
      } else if (currentUser.role.toLowerCase() === 'coach') {
        updatePayload.title = updatedUser.title;
        updatePayload.about = updatedUser.about;
        updatePayload.specializations = updatedUser.tags;
        
        // Handle certificates if they exist
        if (updatedUser.certificates && updatedUser.certificates.length > 0) {
          updatePayload.base64encodedFiles = updatedUser.certificates.map(cert => cert.url);
        }
      } else if (currentUser.role.toLowerCase() === 'admin') {
        updatePayload.phoneNumber = updatedUser.phoneNumber;
      }

      // Handle profile image if it exists
      if (updatedUser.avatarUrl) {
        updatePayload.base64encodedImage = updatedUser.avatarUrl;
      }

      // Make API call to update profile
      const response = await api.put(`/users/${currentUser.id}`, updatePayload);
      
      // Update local storage with new user data
      const updatedUserData = response.data;
      persistAuthState(updatedUserData, true);

      return updatedUserData;
    } catch (error: unknown) {
      console.error("Error updating user profile:", error);
      
      // Handle specific error messages from the API
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue('Failed to update user profile.');
    }
  }
);

export const updatePassword = createAsyncThunk(
	'auth/updatePassword',
	async (
		{ oldPassword, newPassword }: { oldPassword: string; newPassword: string },
		{ getState, rejectWithValue }
	) => {
		try {
			const state = getState() as { auth: AuthState };
			const currentUser = state.auth.user;

			if (!currentUser) {
				return rejectWithValue('No user is logged in.');
			}

      // Make API call to update password
      const response = await api.put(`/users/${currentUser.id}/password`, {
        oldPassword,
        newPassword
      });

      return response.data;
    } catch (error: unknown) {
      console.error("Error updating password:", error);
      
      // Handle specific error messages from the API
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue('Failed to update password.');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser || !currentUser.id) {
        return rejectWithValue('No user is logged in.');
      }

      const response = await api.get(`/users/${currentUser.id}`);
      const userData = response.data;
      
      // Normalize role to lowercase for frontend consistency
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }
      
      // Map specializations to tags for coach role
      if (userData.role === 'coach' && userData.specializations) {
        userData.tags = userData.specializations;
      }

      // Update local storage with fresh user data
      persistAuthState(userData, true);

      return userData;
    } catch (error: unknown) {
      console.error("Error fetching user profile:", error);
      
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue('Failed to fetch user profile.');
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
			});
	},
});

// Create a function to check auth status on app load
export const checkAuthStatus = async (dispatch: any) => {
	const token = localStorage.getItem('accessToken');
	const savedState = loadAuthState();

	if (!token || !savedState.user) {
		// No token or user, clear any potentially inconsistent state
		dispatch(logout());
		return;
	}

	try {
		// Validate token by making a request to a protected endpoint
		// This is optional - you can implement it if your API has a user info endpoint
		// const response = await api.get('/users/me');
		// If the request succeeds, the token is valid
		// You could update the user data here if needed
		// dispatch(login(response.data));

		// For now, just use the saved user data
		dispatch(login(savedState.user));
	} catch (error) {
		// If the token is invalid, log the user out
		console.error('Token validation failed:', error);
		dispatch(logout());
	}
};

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
