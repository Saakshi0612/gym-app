// import React, { useState } from "react";
// import Header from "../common/Header";
// // import HugInput from "./Input";
// import Button from "../common/button";
// import DropdownField from "../common/dropdown";
// //import Calendar from "../common/Calender";
// import DatePickerField from "../common/DatePickerField";

// const ACTIVITY_OPTIONS = [
//   { value: "yoga", label: "Yoga" },
//   { value: "weight-training", label: "Weight Training" },
//   { value: "cardio", label: "Cardio" },
//   { value: "pilates", label: "Pilates" },
//   { value: "crossfit", label: "CrossFit" },
//   { value: "swimming", label: "Swimming" },
//   { value: "cycling", label: "Cycling" },
// ];

// const TIME_SLOT_OPTIONS = [
//   { value: "6am-7am", label: "6 AM - 7 AM" },
//   { value: "7am-8am", label: "7 AM - 8 AM" },
//   { value: "8am-9am", label: "8 AM - 9 AM" },
//   { value: "5pm-6pm", label: "5 PM - 6 PM" },
//   { value: "6pm-7pm", label: "6 PM - 7 PM" },
//   { value: "7pm-8pm", label: "7 PM - 8 PM" },
// ];

// const COACH_NAME_OPTIONS = [
//   { value: "alex-johnson", label: "Alex Johnson" },
//   { value: "maria-garcia", label: "Maria Garcia" },
//   { value: "david-lee", label: "David Lee" },
//   { value: "sophia-patel", label: "Sophia Patel" },
//   { value: "chris-martin", label: "Chris Martin" },
//   { value: "nina-williams", label: "Nina Williams" },
// ];

// const MainSection: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   return (
//     <div>
//       <main>
//         <Header />
//         <div className="flex flex-col text-5xl p-10 gap-4">
//           <h1>Achieve your fitness goals!</h1>
//           <h1>Find a workout and book today.</h1>
//         </div>

//         <div className="  text-base mt-4 px-10 space-y-5">
//           <h2 className="text-gray-800">Book workout</h2>
//           {/* <div className="flex flex-row gap-2 mx-4 items-center mt-4">
//             <HugInput label="Type of Sport" />
//             <HugInput label="Date" />
//             <HugInput label="Time" />
//             <HugInput label="Coach" />
//             <div className="">
//               <Button variant="primary" className=" mt-3 py-4 text-sm">
//                 Find Workout
//               </Button>
//             </div>
//           </div> */}

//           <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end w-full">
//             <div className="flex-1">
//               <DropdownField
//                 label="Type of Sport"
//                 options={ACTIVITY_OPTIONS}
//                 name="type"
//               />
//             </div>
//             <div className="flex-1">
//               <DatePickerField
//                 label="Workout Date"
//                 value={selectedDate}
//                 onChange={setSelectedDate}
//               />
//             </div>
//             <div className="flex-1">
//               <DropdownField
//                 label="Time"
//                 options={TIME_SLOT_OPTIONS}
//                 name="time"
//               />
//             </div>
//             <div className="flex-1">
//               <DropdownField
//                 label="Coach"
//                 options={COACH_NAME_OPTIONS}
//                 name="coach"
//               />
//             </div>
//             <Button variant="primary" className="text-sm self-center">
//               Find Workout
//             </Button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainSection;

import React, { useState } from "react";
import Header from "../common/Header";
import Button from "../common/button";
import DropdownField from "../common/dropdown";
import DatePickerField from "../common/DatePickerField";
import dropdownData from "../../assets/JSON/DropdownSelect.json"; 

const MainSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
              />
            </div>
            <div className="flex-1">
              <DatePickerField
                label="Workout Date"
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Time"
                options={dropdownData.timeSlotOptions}
                name="time"
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Coach"
                options={dropdownData.coachNameOptions}
                name="coach"
              />
            </div>
            <Button variant="primary" className="text-sm self-center">
              Find Workout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainSection;
