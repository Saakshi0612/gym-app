import WorkoutData from "../../assets/JSON/workout.json";
import ScheduledWorkoutCard from "./ScheduleWorkoutCard";

export default function ScheduledWorkoutPage() {
  return (
    <div className="p-4 grid lg:grid-cols-2 gap-4 ">
      {WorkoutData.workouts.map((workout) => (
        <ScheduledWorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
