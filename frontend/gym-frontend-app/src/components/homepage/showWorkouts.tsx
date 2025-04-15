import { useWorkoutContext } from "../../context/WorkoutContext";
import ShowError from "./searchError";
import ShowCochesCard from "./showCoachCard";

export default function ShowWorkouts() {
  const { filteredResults, filters } = useWorkoutContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {filteredResults.length > 0 ? (
        filteredResults.map((session, index) => (
          <ShowCochesCard
            key={index}
            {...session}
            selectedTime={filters.time}
          />
        ))
      ) : (
        <div className="col-span-full flex justify-center mb-10">
          <ShowError />
        </div>
      )}
    </div>
  );
}
