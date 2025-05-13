import { useState, useRef, useEffect } from "react";
import Calendar from "./Calender";
import { format } from "date-fns";
import dropdownIcon from "../../assets/images/dropdown.svg"

interface PeriodCalendarDropdownProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
}

const PeriodCalendarDropdown = ({
  label = "Period",
  startDate,
  endDate,
  onChange,
}: PeriodCalendarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(tempStart || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectedWeekRow, setSelectedWeekRow] = useState<number | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Update local state when props change
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Find the week row that contains the selected date
  useEffect(() => {
    if (!isOpen || !tempStart) {
      setSelectedWeekRow(null);
      return;
    }

    // Find the week row after a short delay to ensure calendar is rendered
    const timer = setTimeout(() => {
      const calendarElement = containerRef.current?.querySelector('table');
      if (!calendarElement) return;

      // Find all rows in the calendar
      const rows = Array.from(calendarElement.querySelectorAll('tr'));
      
      // Skip the header row
      const dataRows = rows.slice(1);
      
      // Find the row that contains our selected date
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const cells = Array.from(row.querySelectorAll('td'));
        
        const hasSelectedDate = cells.some(cell => {
          const button = cell.querySelector('button');
          if (!button) return false;
          
          const dayText = button.textContent?.trim();
          return dayText === tempStart.getDate().toString();
        });
        
        if (hasSelectedDate) {
          setSelectedWeekRow(i);
          
          // Add the highlight styling to this row
          dataRows.forEach(r => r.classList.remove('week-highlight'));
          row.classList.add('week-highlight');
          break;
        }
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isOpen, tempStart, currentMonth]);

  const handleDateSelect = (date: Date) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date);
      setTempEnd(null);
    } else if (tempStart && !tempEnd) {
      if (date < tempStart) {
        setTempStart(date);
        setTempEnd(tempStart);
        onChange(date, tempStart);
      } else {
        setTempEnd(date);
        onChange(tempStart, date);
      }
      setIsOpen(false);
    }
  };

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  const handleMouseEnter = (date: Date) => {
    if (tempStart && !tempEnd) {
      setHoverDate(date);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const formattedLabel =
    startDate && endDate
      ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
      : "Select period";

  // Pass these props to your Calendar component
  const calendarProps = {
    selectedDate: tempStart || new Date(),
    onDateSelect: handleDateSelect,
    currentDate: currentMonth,
    onMonthChange: handleMonthChange,
    // Add these new props for range selection styling
    isRangeSelection: true,
    rangeStart: tempStart,
    rangeEnd: tempEnd || hoverDate,
    onDateHover: handleMouseEnter,
    onDateLeave: handleMouseLeave,
    // Style customizations for the range
    rangeStyles: {
      inRange: "bg-blue-100", // Light blue background for dates in range
      rangeStart: "bg-blue-500 text-white rounded-l-full", // Blue background with left rounded corner
      rangeEnd: "bg-blue-500 text-white rounded-r-full", // Blue background with right rounded corner
      singleDay: "bg-blue-500 text-white rounded-full" // For when start and end are the same
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Add custom CSS for the week row highlighting */}
      <style>{`
        /* Style for the highlighted week row */
        tr.week-highlight {
          position: relative;
        }
        
        tr.week-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10px;
          right: 10px;
          bottom: 0;
          background-color: #DBEAFE; /* Light blue color */
          border-radius: 9999px; /* Fully rounded corners */
          z-index: 0;
        }
        
        tr.week-highlight td {
          position: relative;
          background-color: transparent !important;
        }
        
        tr.week-highlight button {
          position: relative;
          z-index: 1;
          background-color: transparent !important;
        }
      `}</style>
      
      <fieldset
        className="border rounded-md border-[#DADADA] py-1 font-[lexend] text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white"
      >
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px] ml-1 px-1 bg-white text-[#4B5563]">
          {label}
        </legend>

        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full p-2 pt-0 rounded bg-white flex justify-between items-center font-light focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {formattedLabel}
            <img
              src={dropdownIcon}
              alt="Toggle Dropdown"
              className={`w-5 h-5 transition-transform duration-100 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-[#DADADA]">
              <Calendar {...calendarProps} />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};

export default PeriodCalendarDropdown;