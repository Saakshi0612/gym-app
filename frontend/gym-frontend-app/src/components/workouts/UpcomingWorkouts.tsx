import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UpcomingWorkout, UpcomingWorkoutsResponse } from '../../types/components/coach.types';

interface UpcomingWorkoutsProps {
    coachId: string;
    onWorkoutsLoaded?: (workouts: UpcomingWorkout[]) => void; // Optional callback for parent component
}

const UpcomingWorkouts: React.FC<UpcomingWorkoutsProps> = ({ coachId, onWorkoutsLoaded }) => {
    const [upcomingWorkouts, setUpcomingWorkouts] = useState<UpcomingWorkout[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Format date and time for display
    const formatDateTime = (dateString: string, workout: UpcomingWorkout): string => {
        try {
          // Parse the main date
          const workoutDate = new Date(dateString);
          
          if (isNaN(workoutDate.getTime())) {
            console.error("Invalid date format:", dateString);
            return "Invalid date";
          }
          
          // If we have slot details with start time
          if (workout.slotDetails && workout.slotDetails.startTime) {
            // Get the UTC hour from the slot details
            const slotStartTime = new Date(workout.slotDetails.startTime);
            const utcHour = slotStartTime.getUTCHours();
            const utcMinutes = slotStartTime.getUTCMinutes();
            
            // Create a new date with the correct date
            const combinedDateTime = new Date(workoutDate);
            
            // Set the UTC time (this will automatically convert to local time)
            combinedDateTime.setUTCHours(utcHour, utcMinutes, 0, 0);
            
            // Format as "May 5, 2025, 9:00 AM" in local time
            return combinedDateTime.toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            });
          }
          
          // Fallback to just the date
          return workoutDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }) + " (time not specified)";
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Date error";
        }
      };
    // Fetch upcoming workouts for the coach
    useEffect(() => {
        const fetchUpcomingWorkouts = async () => {
            if (!coachId) {
                setError("Coach ID is required");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<UpcomingWorkoutsResponse>(
                    `https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches/${coachId}/workouts`
                );

                if (response.data.success) {
                    setUpcomingWorkouts(response.data.workouts);
                    console.log('Upcoming workouts:', response.data.workouts);
                    console.log('Upcoming workouts detailed:', response.data.workouts.map(workout => ({
                        id: workout._id,
                        activity: workout.activity,
                        date: workout.date,
                        slotDetails: workout.slotDetails ? {
                          startTime: workout.slotDetails.startTime,
                          endTime: workout.slotDetails.endTime
                        } : 'No slot details'
                      })));

                    // Call the callback if provided
                    if (onWorkoutsLoaded) {
                        onWorkoutsLoaded(response.data.workouts);
                    }
                } else {
                    console.error("API returned error:", response.data);
                    setError("Failed to fetch upcoming workouts");
                    setUpcomingWorkouts([]);
                }
            } catch (err) {
                console.error("Error fetching upcoming workouts:", err);
                setError("An error occurred while fetching upcoming workouts");
                setUpcomingWorkouts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingWorkouts();
    }, [coachId, onWorkoutsLoaded]);

    // Function to refresh workouts (can be called after booking a new workout)
    const refreshWorkouts = async () => {
        setLoading(true);
        try {
            const response = await axios.get<UpcomingWorkoutsResponse>(
                `https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches/${coachId}/workouts`
            );

            if (response.data.success) {
                setUpcomingWorkouts(response.data.workouts);

                if (onWorkoutsLoaded) {
                    onWorkoutsLoaded(response.data.workouts);
                }
            } else {
                setError("Failed to refresh upcoming workouts");
            }
        } catch (err) {
            setError("An error occurred while refreshing upcoming workouts");
            console.log(err);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium uppercase">Upcoming Workouts</h2>
                {!loading && (
                    <button
                        onClick={refreshWorkouts}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
            ) : upcomingWorkouts.length > 0 ? (
                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                    {upcomingWorkouts.map((workout) => (
                        <div
                            key={workout._id}
                            className="flex justify-between items-center border-l-4 border-blue-400 bg-blue-50 p-3 rounded-r-md mb-2"
                        >
                            <div>
                                <h3 className="font-medium">{workout.activity || workout.name}</h3>
                                <p className="text-sm text-gray-600">{formatDateTime(workout.date, workout)}</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                1 hour
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No upcoming workouts scheduled</p>
            )}
        </div>
    );
};

export default UpcomingWorkouts;