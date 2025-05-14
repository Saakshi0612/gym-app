/* eslint-disable */
// @ts-nocheck
import { useEffect, useState } from "react";
import ScheduledWorkoutCard from "./scheduleWorkoutCard";
import axios from "axios";
import { useAppSelector } from "../../store/store";
 
export default function ScheduledWorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.user?.id;
 
  // Function to format time from ISO string to readable format
  const formatTimeFromISO = (isoTimeString) => {
    if (!isoTimeString) return 'N/A';
   
    try {
      // Check if it's a range with a hyphen
      if (isoTimeString.includes('-')) {
        const [startISO, endISO] = isoTimeString.split('-').map(str => str.trim());
       
        const startTime = new Date(startISO);
        const endTime = new Date(endISO);
       
        const startFormatted = startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
       
        const endFormatted = endTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
       
        return `${startFormatted} - ${endFormatted}`;
      } else {
        // Single time
        const time = new Date(isoTimeString);
        return time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (e) {
      console.error("Error formatting time:", e);
      return isoTimeString; // Return the original string if parsing fails
    }
  };
 
  // Function to fetch workouts from API
  const fetchWorkouts = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
   
    setLoading(true);
   
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
     
      console.log("Fetching workouts for user:", userId);
     
      // Call your local backend API to get the user's workouts
      const response = await axios.get(
        `http://localhost:8080/api/workouts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
     
      console.log("API Response:", response.data);
     
      // Check if the response contains workout data
      let rawWorkouts = [];
     
      // Handle different response formats
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        rawWorkouts = response.data.data;
      } else if (response.data && response.data.message && Array.isArray(response.data.message)) {
        rawWorkouts = response.data.message;
      } else if (response.data && Array.isArray(response.data)) {
        rawWorkouts = response.data;
      }
     
      if (rawWorkouts.length > 0) {
        // Transform the backend data to match your frontend workout structure
        const transformedWorkouts = rawWorkouts.map(workout => {
          console.log("Processing workout:", workout);
         
          // Extract coach data
          let coachName = 'Your Coach';
          if (workout.coachData) {
            coachName = workout.coachData.name || 'Your Coach';
          }
         
          // Format the date
          const workoutDate = new Date(workout.date);
          const formattedDate = workoutDate.toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
         
          // Get time from slot
          let timeSlot = 'N/A';
         
          // If there's a slot object with startTime and endTime
          if (workout.slot && typeof workout.slot === 'object') {
            if (workout.slot.startTime && workout.slot.endTime) {
              const startTime = new Date(workout.slot.startTime);
              const endTime = new Date(workout.slot.endTime);
             
              const startFormatted = startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
             
              const endFormatted = endTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
             
              timeSlot = `${startFormatted} - ${endFormatted}`;
            } else if (workout.slot.time) {
              timeSlot = formatTimeFromISO(workout.slot.time);
            }
          }
          
          let status = 'Scheduled';
if (workout.state === 'CANCELLED') status = 'Canceled';
else if (workout.state === 'FINISHED') status = 'Finished';
else if (workout.state === 'WAITING_FOR_FEEDBACK') status = 'Waiting for Feedback';
else if (workout.state === 'SCHEDULED') status = 'Scheduled';
         
          return {
            id: workout._id,
            type_of_sport: workout.activity || 'Workout Session',
            description: `Personal training session with ${coachName}`,
            time: timeSlot,
            date: formattedDate,
            workout_status: status,
            imageUrl: workout.coachData?.profilePicture || 'https://via.placeholder.com/150',
            coachName: coachName,
            // Store original data for actions like cancellation
            originalData: workout
          };
        });
       
        console.log("Transformed workouts:", transformedWorkouts);
        setWorkouts(transformedWorkouts);
      } else {
        console.warn("No workout data found in response:", response.data);
        setWorkouts([]);
      }
     
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setError("Failed to load your workouts. Please try again later.");
      setLoading(false);
    }
  };
 
  // Initial fetch
  useEffect(() => {
    fetchWorkouts();
   
    // Set up event listeners for workout changes
    const handleWorkoutChange = () => {
      fetchWorkouts();
    };
   
    window.addEventListener('workoutBooked', handleWorkoutChange);
    window.addEventListener('workoutCancelled', handleWorkoutChange);
   
    return () => {
      window.removeEventListener('workoutBooked', handleWorkoutChange);
      window.removeEventListener('workoutCancelled', handleWorkoutChange);
    };
  }, [userId]);
 
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-lime-500 border-gray-200 mb-2"></div>
          <p>Loading your workouts...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
        <p>{error}</p>
        <button
          onClick={fetchWorkouts}
          className="mt-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }
 
  if (workouts.length === 0) {
    return (
      <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-600 mb-2">You don't have any scheduled workouts yet.</p>
        <p className="text-gray-500">Book a session with one of our coaches to get started!</p>
      </div>
    );
  }
 
  return (
    <div className="p-4 grid lg:grid-cols-2 gap-4">
      {workouts.map((workout) => (
        <ScheduledWorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}