/* eslint-disable */
// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = 'https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/workouts';

interface BookingState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BookingState = {
  loading: false,
  success: false,
  error: null,
};

// Book a workout session
export const bookWorkout = createAsyncThunk(
  'booking/bookWorkout',
  async (
    bookingData: {
      activity: string;
      coach: string;
      client: string;
      date: string;
      slot: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('User is not authenticated.');
      }

      // Use the same endpoint structure as your other API calls
      const response = await axios.post(
        `${BASE_URL}/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      let errorMessage = 'Failed to book workout. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookWorkout.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(bookWorkout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(bookWorkout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;

