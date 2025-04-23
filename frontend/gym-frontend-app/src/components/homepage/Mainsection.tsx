import React, { useState, useEffect } from "react";
import Arrow from "../../assets/images/arrow.svg";
import Underlined from "../../assets/images/fitnessg.svg";
import DatePickerField from "../common/DatePickerField";
import dropdownData from "../../assets/JSON/DropdownSelect.json";
import { useWorkoutContext } from "../../context/WorkoutContext";
import ShowWorkouts from "./showWorkouts";
import DropdownField from "../common/Selection";
import Button from "../common/ButtonComponent";
import axios from "axios";

type TimeSlotOption = {
  value: string;
  label: string;
};

const filterUpcomingTimeSlots = (
  timeSlotOptions: TimeSlotOption[],
  selectedDate: Date
): TimeSlotOption[] => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const timeStringToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)(am|pm)/i);
    if (!match) return 0;

    let [_, hourStr, meridiem] = match;
    let hour = parseInt(hourStr, 10);

    if (meridiem.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (meridiem.toLowerCase() === "am" && hour === 12) hour = 0;

    return hour * 60;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return timeSlotOptions.filter((slot) => {
    if (slot.value.toLowerCase() === "all") return true;
    if (!isToday(selectedDate)) return true; // show all slots if not today

    const [startTime] = slot.value.split("-");
    const startMinutes = timeStringToMinutes(startTime);
    return startMinutes >= currentMinutes;
  });
};

const MainSection: React.FC = () => {
  const {
    setFilteredResults,
    setAllResults,
    setShowResults,
    showResults,
    allResults,
  } = useWorkoutContext();

  const [filters, setFilters] = useState({
    type: "All",
    time: "All",
    coach: "All",
    date: new Date(),
  });

  // helper to convert string date to Date object
  const parseDate = (dateString: string) =>
    new Date(`${dateString}, ${new Date().getFullYear()}`);

  const filteredTimeOptions = React.useMemo(() => {
    return filterUpcomingTimeSlots(dropdownData.timeSlotOptions, filters.date);
  }, [filters.date]);

  // Fetch and show today's and future workouts
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { coaches } = (await axios.get("./Coaches.json")).data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Only sessions today or in the future
        const upcomingWorkouts = coaches.filter((session: any) => {
          const sessionDate = parseDate(session.date);
          return sessionDate >= today;
        });

        setAllResults(upcomingWorkouts);
        setFilteredResults(upcomingWorkouts);
        setShowResults(true);
      } catch (error) {
        console.error("Error loading coaches:", error);
      }
    };

    fetchCoaches();
  }, []);

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
    const formattedDate = filters.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });

    const results = allResults.filter(
      (session) =>
        (filters.type === "All" || session.type_of_sport === filters.type) &&
        (filters.time === "All" || session.time.includes(filters.time)) &&
        (filters.coach === "All" || session.name_of_coach === filters.coach) &&
        (!filters.date || session.date === formattedDate)
    );

		setFilteredResults(results);
		setShowResults(true);
	};

  return (
    <div>
      <main>
        <div className="flex flex-col lg:text-5xl md:text-4xl sm:text-3xl p-10 gap-4">
          <h1>
            Achieve your{" "}
            <span className="relative inline-block z-10">
              fitness goals!
              <span className="absolute left-0 bottom-[-16px] w-full h-[8px] z-0">
                <img src={Underlined} alt="" />
              </span>
            </span>
          </h1>

          <h2 className="flex flex-row gap-4 lg:text-5xl md:text-4xl sm:text-3xl text-center mb-4">
            Find a workout and book today.
            <img src={Arrow} className="hidden sm:inline-block" />
          </h2>
        </div>

        <div className="text-base mt-2 px-4 md:px-10 space-y-5">
          <h2 className="text-gray-800 font-medium">Book workout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end w-full">
            <div className="z-40">
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

            <DatePickerField
              label="Workout Date"
              value={filters.date}
              onChange={handleDateChange}
            />

            <div className="z-30">
              <DropdownField
                label="Time"
                options={filteredTimeOptions}
                name="time"
                onChange={(value: string) =>
                  handleDropdownChange("time", value)
                }
                value={filters.time}
              />
            </div>

            <div className="z-20">
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
