// src/redux/workoutSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL once
const BASE_URL =
	'https://dao5ej9iwk.execute-api.ap-southeast-1.amazonaws.com/dev/workout';

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

interface WorkoutState {
	coaches: Coach[];
	specializations: Specialization[];
	availableTimeSlots: TimeSlot[];
	allCoachesWithSlots: Coach[];
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
			const [coachRes, sportRes, timeSlotsRes, allCoachesRes] =
				await Promise.all([
					axios.get<{ coaches: Coach[] }>(`${BASE_URL}/getCoachName`),
					axios.get<{ specializations: Specialization[] }>(
						`${BASE_URL}/getSportName`
					),
					axios.get<{ Available_Time_Slots: TimeSlot[] }>(
						`${BASE_URL}/getAvailableTimeSlots`
					),
					axios.get<{ coaches: Coach[] }>(`${BASE_URL}/getAllWorkout`),
				]);

			return {
				coaches: coachRes.data.coaches,
				specializations: sportRes.data.specializations,
				availableTimeSlots: timeSlotsRes.data.Available_Time_Slots,
				allCoachesWithSlots: allCoachesRes.data.coaches,
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
			coach_id: string;
			sport_name: string;
			date: string;
			time_slot: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/searchWorkout`,
				filterData
			);

			// Log or validate the structure of the response data
			console.log('Filter data : ', filterData);
			console.log('Filtered Coaches:', response.data.coaches);

			// Ensure the data structure is as expected, and return only the filtered data
			return response.data.coaches; // Or modify if needed based on structure
		} catch (error: any) {
			return rejectWithValue(error.message); // Handle error appropriately
		}
	}
);

const workoutSlice = createSlice({
	name: 'workout',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWorkoutData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWorkoutData.fulfilled, (state, action) => {
				state.loading = false;
				state.coaches = action.payload.coaches;
				state.specializations = action.payload.specializations;
				state.availableTimeSlots = action.payload.availableTimeSlots;
				state.allCoachesWithSlots = action.payload.allCoachesWithSlots;
			})
			.addCase(fetchWorkoutData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(filterWorkout.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(filterWorkout.fulfilled, (state, action) => {
				state.loading = false;
				state.allCoachesWithSlots = action.payload;
			})
			.addCase(filterWorkout.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || 'An error occurred while filtering workouts';
			});
	},
});

export default workoutSlice.reducer;
