/* eslint-disable */
// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL once
const BASE_URL = 'http://localhost:8080/api/coaches';
const BASE_URL2 = 'http://localhost:8080/api/workouts';

type Coach = {
	id: string;
	firstName: string;
	lastName: string;
	rating: number;
	specializations: string[];
	availableSlots: any[];
};
type Specialization = { specialization: string };
type TimeSlot = { id: string; slot: string };

// This reflects the actual structure returned by the filterWorkout API
type CoachWithSlots = {
	Coaches: Coach;
	Available_Time_Slots: TimeSlot[];
};

interface WorkoutState {
	coaches: Coach[];
	specializations: Specialization[];
	availableTimeSlots: TimeSlot[];
	allCoachesWithSlots: CoachWithSlots[];
	loading: boolean;
	error: string | null;
}

const initialState: WorkoutState = {
	coaches: [],
	specializations: [],
	availableTimeSlots: [],
	allCoachesWithSlots: [],
	loading: false,
	error: null,
};

// Fetch all APIs
export const fetchWorkoutData = createAsyncThunk(
	'workout/fetchWorkoutData',
	async (_, { rejectWithValue }) => {
		try {
			const [coachRes, sportRes, timeSlotsRes] = await Promise.all([
				axios.get<{ coaches: Coach[] }>(`${BASE_URL}/getCoachesName`),
				axios.get<{ specializations: Specialization[] }>(
					`${BASE_URL}/getSportsType`
				),
				axios.get<{ Available_Time_Slots: TimeSlot[] }>(
					`${BASE_URL}/getAvailableTimeSlot`
				),
			]);

			return {
				coaches: coachRes.data.coaches,
				specializations: sportRes.data.specialization,
				availableTimeSlots: timeSlotsRes.data.time_slot,
			};
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

// Filter workout based on user selection
export const filterWorkout = createAsyncThunk(
	'workout/filterWorkout',
	async (
		filterData: {
			coach: string;
			sport_type: string;
			date: string;
			time_slot: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.get(`${BASE_URL2}/getAvailableWorkouts`, {
				params: filterData,
			});

			// Return full array as-is (array of { Coaches, Available_Time_Slots })
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

const workoutSlice = createSlice({
	name: 'workout',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// For initial data
			.addCase(fetchWorkoutData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWorkoutData.fulfilled, (state, action) => {
				state.loading = false;
				state.coaches = action.payload.coaches;
				state.specializations = action.payload.specializations;
				state.availableTimeSlots = action.payload.availableTimeSlots;
			})
			.addCase(fetchWorkoutData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// For filtered workout
			.addCase(filterWorkout.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(filterWorkout.fulfilled, (state, action) => {
				state.loading = false;
				state.allCoachesWithSlots = action.payload; // full array of { Coaches, Available_Time_Slots }
			})
			.addCase(filterWorkout.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || 'An error occurred while filtering workouts';
			});
	},
});

export default workoutSlice.reducer;
