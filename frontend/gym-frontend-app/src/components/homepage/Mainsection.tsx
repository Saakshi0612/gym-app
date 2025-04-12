import React, { useState } from "react";
import Header from "../common/Header";
import Arrow from "../../assets/images/arrow.svg"
import Underlined from "../../assets/images/fitnessg.svg"
import DatePickerField from "../common/DatePickerField";
import dropdownData from "../../assets/JSON/DropdownSelect.json";
import { useWorkoutContext } from "../../context/WorkoutContext";
import ShowWorkouts from "./showWorkouts";
import DropdownField from "../common/Selection";
import Button from "../common/ButtonComponent";
import axios from "axios";

const MainSection: React.FC = () => {
  const { setFilteredResults, setShowResults, showResults } =
    useWorkoutContext();

  const [filters, setFilters] = useState({
    type: "All",
    time: "All",
    coach: "All",
    date: new Date(), // default value
  });

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

  const handleSubmit = async () => {
    try {
      const { coaches } = (await axios.get("./Coaches.json")).data;

      const formattedDate = filters.date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });

      const results = coaches.filter(
        (session) =>
          (filters.type === "All" || session.type_of_sport === filters.type) &&
          (filters.time === "All" || session.time.includes(filters.time)) &&
          (filters.coach === "All" ||
            session.name_of_coach === filters.coach) &&
          (!filters.date || session.date === formattedDate)
      );

      setFilteredResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error filtering coaches:", error);
    }
  };

  return (
    <div>
      <main>       
        <div className="flex flex-col  lg:text-5xl md:text-4xl sm:text-3xl p-10 gap-4">
          <h1>
            Achieve your{" "}
            <span className="relative inline-block z-10">
              fitness goals!
              <span className="absolute left-0 bottom-[-16px] w-full h-[8px] z-0">
                <img src={Underlined} alt="" />
              </span>
            </span>
          </h1>

          <h2 className="flex flex-row gap-4  lg:text-5xl md:text-4xl sm:text-3xl text-center mb-4">
            Find a workout and book today.
           <img src={Arrow} alt="" />
          </h2>
        </div>

        <div className="text-base mt-2 px-4 md:px-10 space-y-5">
          <h2 className="text-gray-800 font-medium">Book workout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end w-full">
            <div className="w-full z-60">
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
            <div className="w-full z-50">
              <DatePickerField
                label="Workout Date"
                value={filters.date}
                onChange={handleDateChange}
              />
            </div>
            <div className="w-full z-40">
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
            <div className="w-full z-30">
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
            <div className="w-full sm:col-span-2 md:col-span-4 lg:col-span-1 flex justify-center lg:justify-start">
              <Button
                variant="primary"
                className="text-sm w-full sm:w-auto md:w-1/3 lg:w-full"
                onClick={handleSubmit}
              >
                Find Workout
              </Button>
            </div>
          </div>
          {showResults && <ShowWorkouts />}
        </div>
      </main>
    </div>
  );
};

export default MainSection;
