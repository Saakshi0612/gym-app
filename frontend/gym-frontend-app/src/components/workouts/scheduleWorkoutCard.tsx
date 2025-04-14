import { useState } from "react";
import { Calendar } from "lucide-react";
import CancelWorkoutModal from "./cancelWorkoutPopup";
import WorkoutFeedbackModal from "./workoutFeebackModal";
import Button from "../common/ButtonComponent";

interface Workout {
  id: number;
  type_of_sport: string;
  description: string;
  time: string;
  date: string;
  workout_status: string;
  imageUrl: string;
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
  const currentStyle = statusStyles[workout.workout_status];
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="p-5 text-primary-black border rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">{workout.type_of_sport}</p>

        {currentStyle && (
          <p
            className={`px-3 py-1 rounded-2xl text-sm ${currentStyle.bg} ${currentStyle.text}`}
          >
            {workout.workout_status}
          </p>
        )}
      </div>

      <p className="text-justify text-sm mb-3">{workout.description}</p>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
        <Calendar className="w-5 h-5" />
        <p>{workout.date},</p>
        <p>{workout.time}AM</p>
      </div>

      {(workout.workout_status === "Scheduled" ||
        workout.workout_status === "Waiting for Feedback") && (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="rounded-full px-4 py-2 text-sm"
            onClick={() =>
              workout.workout_status === "Scheduled"
                ? setIsCancelOpen(true)
                : setIsFeedbackOpen(true)
            }
          >
            {workout.workout_status === "Scheduled"
              ? "Cancel Workout"
              : "Leave Feedback"}
          </Button>
        </div>
      )}

      {/* Cancel Workout Modal */}
      <CancelWorkoutModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onCancel={() => {
          console.log("Workout canceled");
          setIsCancelOpen(false);
        }}
      />

      {/* Feedback Modal */}
      <WorkoutFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(rating, comment) => {
          console.log("Feedback submitted:", { rating, comment });
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
