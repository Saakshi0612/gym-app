import React, { useState } from "react";
import Header from "../common/Header";
import Button from "../common/button";
import DropdownField from "../common/dropdown";
import DatePickerField from "../common/DatePickerField";
import dropdownData from "../../assets/JSON/DropdownSelect.json";
import CoachesData from "../../assets/JSON/Coaches.json";
import { useWorkoutContext } from "../../context/WorkoutContext";

import ShowWorkouts from "./showWorkouts";

const MainSection: React.FC = () => {
  const { setFilteredResults, setShowResults, showResults } =
    useWorkoutContext();

  const [filters, setFilters] = useState({
    type: "",
    time: "",
    coach: "",
    date: new Date(), // default value
  });

  console.log(filters);

  const handleDropdownChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setFilters((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSubmit = () => {
    // const formattedDate = filters.date.toISOString().split("T")[0];

    const results = CoachesData.coaches.filter(
      (session) =>
        (!filters.type || session.type_of_sport === filters.type) &&
        // (!filters.time || session.time.includes(filters.time)) &&
        (!filters.coach || session.name_of_coach === filters.coach)
      // (!filters.date || session.date === formattedDate)
    );

    console.log(results);

    setFilteredResults(results);
    setShowResults(true);
  };

  return (
    <div>
      <main>
        <Header />
        <div className="flex flex-col text-5xl p-10 gap-4">
          <h1>Achieve your fitness goals!</h1>
          <h1>Find a workout and book today.</h1>
        </div>

        <div className="text-base mt-4 px-10 space-y-5">
          <h2 className="text-gray-800">Book workout</h2>

          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end w-full">
            <div className="flex-1">
              <DropdownField
                label="Type of Sport"
                options={dropdownData.activityOptions}
                name="type"
                onChange={(value: string) =>
                  handleDropdownChange("type", value)
                }
                value={filters.type}
              />
            </div>
            <div className="flex-1">
              <DatePickerField
                label="Workout Date"
                value={filters.date}
                onChange={handleDateChange}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Time"
                options={dropdownData.timeSlotOptions}
                name="time"
                onChange={(value: string) =>
                  handleDropdownChange("time", value)
                }
                value={filters.time}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Coach"
                options={dropdownData.coachNameOptions}
                name="coach"
                onChange={(value: string) =>
                  handleDropdownChange("coach", value)
                }
                value={filters.coach}
              />
            </div>
            <Button
              variant="primary"
              className="text-sm self-center"
              onClick={handleSubmit}
            >
              Find Workout
            </Button>
          </div>
        </div>

        {showResults && <ShowWorkouts />}
      </main>
    </div>
  );
};

export default MainSection;
