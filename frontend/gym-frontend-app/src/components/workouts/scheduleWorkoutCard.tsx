import { useState } from "react";
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
  coachName?: string; // Added coach name property
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
  const currentStyle = statusStyles[workout.workout_status] || statusStyles.Scheduled;
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Check if workout is in the past (for feedback option)
  const isPastWorkout = () => {
    const workoutDate = new Date(`${workout.date} ${workout.time}`);
    const now = new Date();
    return workoutDate < now;
  };

  // Determine if we should show the feedback button
  const showFeedbackButton = workout.workout_status === "Waiting for Feedback" || 
    (workout.workout_status === "Scheduled" && isPastWorkout());

  return (
    <div className="p-5 text-primary-black border rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">{workout.type_of_sport}</p>

        <p
          className={`px-3 py-1 rounded-2xl text-sm ${currentStyle.bg} ${currentStyle.text}`}
        >
          {workout.workout_status}
        </p>
      </div>

     

      {/* Description */}
      <p className="text-justify text-sm mb-3">{workout.description}</p>

      {/* Date and Time - made more prominent */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          <p><span className="font-medium">Date:</span> {workout.date}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <p><span className="font-medium">Time:</span> {workout.time}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end">
        {workout.workout_status === "Scheduled" && !isPastWorkout() && (
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
        onCancel={() => {
          console.log("Workout canceled");
          window.dispatchEvent(new Event('workoutCancelled'));
          setIsCancelOpen(false);
        }}
        workoutId={workout.id}
      />

      {/* Feedback Modal */}
      <WorkoutFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(rating, comment) => {
          console.log("Feedback submitted:", { rating, comment, workoutId: workout.id });
          setIsFeedbackOpen(false);
        }}
        workoutType={workout.type_of_sport}
        time={workout.time}
        date={workout.date}
        imageUrl={workout.imageUrl}
      />
    </div>
  );
}