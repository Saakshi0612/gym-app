import React, { useState } from "react";
import Header from "../common/Header";
import Button from "../common/button";
import DropdownField from "../common/dropdown";
import DatePickerField from "../common/DatePickerField";
import dropdownData from "../../assets/JSON/DropdownSelect.json"; 
import Underlined from "../../assets/images/fitnessg.svg"
import Arrow from "../../assets/images/arrow.svg"


const MainSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <main>
        <Header />
       
    <div className="flex flex-col  lg:text-5xl md:text-4xl sm:text-3xl p-10 gap-4">
  <h1>
    Achieve your{' '}
    <span className="relative inline-block z-10">
      fitness goals!
      <span className="absolute left-0 bottom-[-16px] w-full h-[8px] z-0">
       <img src={Underlined} />
      </span>
    </span>
  </h1>

  <h1 className="flex flex-row gap-4  lg:text-5xl md:text-4xl sm:text-3xl text-center mb-4">
  Find a workout and book. <img src={Arrow} className="mt-4" />
</h1>

</div>
    <div className="text-base mt-4 px-4 md:px-10 space-y-5">
  <h2 className="text-gray-800 font-medium">Book workout</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end w-full">
    <div className="w-full">
      <DropdownField
        label="Type of Sport"
        options={dropdownData.activityOptions}
        name="type"
      />
    </div>
    <div className="w-full">
      <DatePickerField
        label="Workout Date"
        value={selectedDate}
        onChange={setSelectedDate}
      />
    </div>
    <div className="w-full">
      <DropdownField
        label="Time"
        options={dropdownData.timeSlotOptions}
        name="time"
      />
    </div>
    <div className="w-full">
      <DropdownField
        label="Coach"
        options={dropdownData.coachNameOptions}
        name="coach"
      />
    </div>
    <div className="w-full sm:col-span-2 md:col-span-4 lg:col-span-1 flex justify-center lg:justify-start">
      <Button variant="primary" className="text-sm w-full sm:w-auto md:w-1/3 lg:w-full">
        Find Workout
      </Button>
    </div>
  </div>
</div>
      </main>
    </div>
  );
};

export default MainSection;