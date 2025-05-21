/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from "react";
import { Calendar, User, Clock } from "lucide-react";
import CancelWorkoutModal from "./cancelWorkoutPopup";
import WorkoutFeedbackModal from "./workoutFeebackModal";
import Button from "../common/ButtonComponent";

interface Workout {
  id: number | string;
  type_of_sport: string;
  description: string;
  time: string;
  date: string;
  workout_status: string;
  imageUrl: string;
  coachName?: string;
  originalData?: any; // Original data from API
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  Scheduled: {
    bg: "bg-semantic-blue",
    text: "text-white",
  },
  "Waiting for Feedback": {
    bg: "bg-semantic-grey",
    text: "text-white",
  },
  Finished: {
    bg: "bg-semantic-yellow",
    text: "text-primary-black",
  },
  Canceled: {
    bg: "bg-semantic-red",
    text: "text-white",
  },
};

export default function ScheduledWorkoutCard({
  workout,
}: {
  workout: Workout;
}) {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
  const currentStyle = statusStyles[currentWorkout.workout_status] || statusStyles.Scheduled;
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Update local state when workout prop changes, with localStorage check
  useEffect(() => {
    // Check if we have a saved display status in localStorage
    const savedDisplayStatus = localStorage.getItem(`workout-${workout.id}-display-status`);
    
    if (savedDisplayStatus === 'Finished' && 
        (workout.workout_status === 'Waiting for Feedback' || workout.workout_status === 'Scheduled')) {
      setCurrentWorkout({
        ...workout,
        workout_status: 'Finished'
      });
    } else {
      setCurrentWorkout(workout);
    }
  }, [workout]);

  // Check if workout is in the past (for feedback option)
  const isPastWorkout = () => {
    try {
      // Parse the date string to a Date object
      const dateParts = currentWorkout.date.split(' ');
      const month = dateParts[0];
      const day = parseInt(dateParts[1].replace(',', ''));
      const year = parseInt(dateParts[2]);
      
      // Parse time (assuming format like "10:00 AM - 11:00 AM")
      let timeStr = currentWorkout.time;
      if (timeStr.includes('-')) {
        timeStr = timeStr.split('-')[0].trim();
      }
      
      // Create a date string that JavaScript can parse
      const dateTimeStr = `${month} ${day}, ${year} ${timeStr}`;
      const workoutDate = new Date(dateTimeStr);
      
      const now = new Date();
      return workoutDate < now;
    } catch (error) {
      console.error("Error parsing workout date:", error);
      return false;
    }
  };

  // Determine if we should show the feedback button
  const showFeedbackButton = currentWorkout.workout_status === "Waiting for Feedback" || 
    (currentWorkout.workout_status === "Scheduled" && isPastWorkout());

  // Handle successful cancellation
  const handleSuccessfulCancel = () => {
    // Update the local workout status
    setCurrentWorkout({
      ...currentWorkout,
      workout_status: "Canceled"
    });
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem(`workout-${currentWorkout.id}-display-status`, "Canceled");
    
    // Notify parent components
    window.dispatchEvent(new Event('workoutCancelled'));
  };

  // Handle successful feedback submission
  const handleFeedbackSubmit = (rating, comment) => {
    console.log("Feedback submitted:", { rating, comment, workoutId: currentWorkout.id });
    
    // Update the local workout status
    const newStatus = "Finished";
    setCurrentWorkout({
      ...currentWorkout,
      workout_status: newStatus
    });
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem(`workout-${currentWorkout.id}-display-status`, newStatus);
    
    // Close the feedback modal
    setIsFeedbackOpen(false);
    
    // Notify parent components
    window.dispatchEvent(new CustomEvent('feedbackSubmitted', {
      detail: {
        workoutId: currentWorkout.id,
        newStatus: newStatus
      }
    }));
  };

  return (
    <div className="p-5 text-primary-black border rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">{currentWorkout.type_of_sport}</p>

        <p
          className={`px-3 py-1 rounded-2xl text-sm ${currentStyle.bg} ${currentStyle.text}`}
        >
          {currentWorkout.workout_status}
        </p>
      </div>

      {/* Description */}
      <p className="text-justify text-sm mb-3">{currentWorkout.description}</p>

      {/* Date and Time - made more prominent */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          <p><span className="font-medium">Date:</span> {currentWorkout.date}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <p><span className="font-medium">Time:</span> {currentWorkout.time}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end">
        {currentWorkout.workout_status === "Scheduled" && !isPastWorkout() && (
          <Button
            variant="secondary"
            className="rounded-full px-4 py-2 text-sm"
            onClick={() => setIsCancelOpen(true)}
          >
            Cancel Workout
          </Button>
        )}
        
        {showFeedbackButton && (
          <Button
            variant="primary"
            className="rounded-full px-4 py-2 text-sm"
            onClick={() => setIsFeedbackOpen(true)}
          >
            Leave Feedback
          </Button>
        )}
      </div>

      {/* Cancel Workout Modal */}
      <CancelWorkoutModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onCancel={handleSuccessfulCancel}
        workoutId={currentWorkout.id}
      />

      {/* Feedback Modal */}
      <WorkoutFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        workoutType={currentWorkout.type_of_sport}
        time={currentWorkout.time}
        date={currentWorkout.date}
        imageUrl={currentWorkout.imageUrl}
        workoutId={currentWorkout.id}
        coachName={currentWorkout.coachName}
      />
    </div>
  );
}