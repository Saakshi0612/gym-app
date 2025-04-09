import React, { useState, useRef, useEffect } from "react";
import Calendar from "./Calender"; // Adjust import path

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const [currentDate, setCurrentDate] = useState(value);
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Close calendar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 relative" ref={ref}>
      <fieldset className="border rounded px-3 py-2">
        <legend className="text-sm mx-2 px-1 text-gray-500">{label}</legend>
        <div
          className="cursor-pointer text-gray-700"
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {value.toDateString()}
        </div>

        {showCalendar && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg">
            <Calendar
              currentDate={currentDate}
              selectedDate={value}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
            />
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default DatePickerField;
