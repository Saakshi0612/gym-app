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
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Format the date to show only month and day
  const formattedDate = value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

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

  // Check if calendar would go off-screen
  const checkPosition = () => {
    if (ref.current && calendarRef.current) {
      const fieldRect = ref.current.getBoundingClientRect();
      const calendarHeight = calendarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // If there's not enough space below, position above
      if (fieldRect.bottom + calendarHeight > viewportHeight && fieldRect.top > calendarHeight) {
        return { top: 'auto', bottom: '100%', marginBottom: '5px' };
      }
    }
    
    // Default position below the input
    return { top: '100%', bottom: 'auto', marginTop: '5px' };
  };

  return (
    <div className="flex-1 relative" ref={ref}>
      <fieldset className="border rounded px-3 py-2">
        <legend className="text-sm mx-2 px-1 text-gray-500">{label}</legend>
        <div
          className="cursor-pointer text-gray-700"
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {formattedDate}
        </div>

        {showCalendar && (
          <div 
            ref={calendarRef}
            className="absolute z-100 bg-white border border-gray-200 rounded shadow-lg left-0" 
            style={{
              width: "min(280px, 90vw)",
              maxWidth: "100vw",
              ...checkPosition()
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
      </fieldset>
    </div>
  );
};

export default DatePickerField;