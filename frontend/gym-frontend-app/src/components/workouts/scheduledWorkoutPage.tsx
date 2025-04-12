import { useEffect, useState } from "react";

import ScheduledWorkoutCard from "./scheduleWorkoutCard";
import axios from "axios";
export default function ScheduledWorkoutPage() {
  const [workout, setWorkout] = useState([]);

  useEffect(() => {
    async function getWorkoutData() {
      try {
        const { workouts } = (await axios.get("./workout.json")).data;
        setWorkout(workouts);
        console.log(workouts);
      } catch (error) {
        console.log(error);
      }
    }
    getWorkoutData();
  }, []);

  return (
    <div className="p-4 grid lg:grid-cols-2 gap-4 ">
      {workout?.map((workout: any) => (
        <ScheduledWorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
