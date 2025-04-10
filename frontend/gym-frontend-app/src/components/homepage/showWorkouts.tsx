// import React from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";
import ShowCochesCard from "./showCoachCard";

export default function ShowWorkouts() {
  const { filteredResults, filters } = useWorkoutContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-10">
      {filteredResults.map((session, index) => (
        <ShowCochesCard key={index} {...session} selectedTime={filters.time} />
      ))}
    </div>
  );
}
