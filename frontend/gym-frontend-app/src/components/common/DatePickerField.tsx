import React, { useState, useRef, useEffect } from "react";
import Calendar from "./Calender"; 
import Dropdownsvg from "../../assets/dropdown.svg"

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [currentDate, setCurrentDate] = useState(value);
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  const formattedDate = value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current && 
        !ref.current.contains(event.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-30" ref={ref}>
      <fieldset className="border rounded-md border-[#DADADA] py-1 font-[lexend] text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white">
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px] ml-1 px-1 bg-white text-[#4B5563]">
          {label}
        </legend>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full p-2 pt-0 rounded bg-white flex justify-between items-center font-light"
          >
            {formattedDate}
            <img
              src={Dropdownsvg}
              alt="Dropdown Icon"
              className={`w-5 h-5 transition-transform duration-100 ${
                showCalendar ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </fieldset>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}

      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg"
          style={{
            width: "min(320px, 90vw)", // Use min() to cap width at 320px or 90% of viewport width
            zIndex: 50,
            maxHeight: "min(400px, 80vh)", // Responsive height too
            overflowY: "auto",
            // Position handling for small screens
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Calendar
            currentDate={currentDate}
            selectedDate={value}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerField;