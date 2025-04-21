// import React from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// // Calendar Component Props
// interface CalendarProps {
//   currentDate: Date;
//   selectedDate: Date;
//   onDateSelect: (date: Date) => void;
//   onMonthChange: (date: Date) => void;
// }

// const Calendar: React.FC<CalendarProps> = ({
//   currentDate,
//   selectedDate,
//   onDateSelect,
//   onMonthChange
// }) => {
//   // Get today's actual date (real current day)
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
  
//   // Get current month and year from the displayed calendar
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();
  
//   // Format the month and year for display
//   const monthYearString = new Intl.DateTimeFormat('en-US', { 
//     month: 'long', 
//     year: 'numeric' 
//   }).format(currentDate);

//   // Get the number of days in the current month
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
//   // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
//   const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

//   // Create an array of days for the current month
//   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
//   // Add empty days at the beginning to align with the correct day of week
//   const calendarDays = [
//     ...Array(firstDayOfMonth).fill(null),
//     ...days
//   ];

//   // Handle month navigation
//   const goToPreviousMonth = () => {
//     const newDate = new Date(currentYear, currentMonth - 1, 1);
//     // Only allow going to previous month if it's not before the current month and year
//     if (newDate.getFullYear() > today.getFullYear() || 
//         (newDate.getFullYear() === today.getFullYear() && 
//          newDate.getMonth() >= today.getMonth())) {
//       onMonthChange(newDate);
//     }
//   };

//   const goToNextMonth = () => {
//     const newDate = new Date(currentYear, currentMonth + 1, 1);
//     onMonthChange(newDate);
//   };

//   // Handle date selection
//   const handleDateSelect = (day: number) => {
//     if (day) {
//       const newSelectedDate = new Date(currentYear, currentMonth, day);
      
//       // Only allow selection of today or future dates
//       if (!isPastDate(day)) {
//         onDateSelect(newSelectedDate);
//       }
//     }
//   };

//   // Check if a date is the currently selected date
//   const isSelectedDate = (day: number) => {
//     return day === selectedDate.getDate() && 
//            currentMonth === selectedDate.getMonth() && 
//            currentYear === selectedDate.getFullYear();
//   };

//   // Check if a date is today (the actual current day)
//   const isToday = (day: number) => {
//     return day === today.getDate() && 
//            currentMonth === today.getMonth() && 
//            currentYear === today.getFullYear();
//   };

//   // Check if a date is in the past
//   const isPastDate = (day: number) => {
//     const dateToCheck = new Date(currentYear, currentMonth, day);
//     dateToCheck.setHours(0, 0, 0, 0); // Reset time part for accurate comparison
//     return dateToCheck < today;
//   };

//   // Check if a date has special indicator (like the dot under July 9th)
//   const hasIndicator = (day: number) => {
//     // This is just an example - you would implement your own logic
//     return day === 9;
//   };

//   // Determine if the previous month button should be disabled
//   const isPreviousMonthDisabled = () => {
//     return currentMonth === today.getMonth() && currentYear === today.getFullYear();
//   };

//   // Days of the week
//   const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

//   // Ensure we're not showing a month before the current month
//   React.useEffect(() => {
//     if (currentDate < today && 
//         (currentDate.getMonth() !== today.getMonth() || 
//          currentDate.getFullYear() !== today.getFullYear())) {
//       onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
//     }
//   }, [currentDate, onMonthChange]);

//   return (
//     <div className="w-full h-full border-r border-gray-100 p-4">
//       {/* Month Navigation */}
//       <div className="flex justify-between items-center mb-6">
//         <button 
//           onClick={goToPreviousMonth}
//           disabled={isPreviousMonthDisabled()}
//           className={`p-1 ${isPreviousMonthDisabled() ? 'opacity-30 cursor-not-allowed' : ''}`}
//         >
//           <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
//         </button>
//         <span className="text-base font-medium">{monthYearString}</span>
//         <button 
//           onClick={goToNextMonth}
//           className="p-1"
//         >
//           <ChevronRightIcon className="h-5 w-5 text-gray-500" />
//         </button>
//       </div>
      
//       {/* Days of Week */}
//       <div className="grid grid-cols-7 text-center mb-2">
//         {daysOfWeek.map((day, index) => (
//           <div key={index} className="text-xs font-medium text-gray-500">
//             {day}
//           </div>
//         ))}
//       </div>
      
//    {/* Calendar Grid */}
// <div className="grid grid-cols-7 gap-1">
//   {calendarDays.map((day, index) => {
//     const isPast = day && isPastDate(day) && !isToday(day);
    
//     return (
//       <div 
//         key={index} 
//         className="aspect-square flex flex-col items-center justify-center relative"
//       >
//         {day && (
//           <>
//             <button
//               onClick={() => !isPast && handleDateSelect(day)}
//               disabled={isPast}
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
//                 ${isSelectedDate(day) 
//                   ? 'bg-green-100 border border-green-300 text-green-800' 
//                   : isToday(day)
//                     ? 'bg-blue-100 border border-blue-300 text-blue-800' 
//                     : isPast
//                       ? 'text-gray-300 cursor-not-allowed' // Gray out past dates
//                       : 'hover:bg-gray-100 text-gray-800'
//                 }`}
//             >
//               {day}
//             </button>
//             {hasIndicator(day) && !isPast && (
//               <div className="h-1 w-1 bg-green-500 rounded-full mt-1"></div>
//             )}
//           </>
//         )}
//         {/* For empty cells */}
//         {!day && (
//           <div className="w-10 h-10"></div>
//         )}
//       </div>
//     );
//   })}
// </div>
//     </div>
//   );
// };

// export default Calendar;

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthYearString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...days];

  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  maxDate.setHours(0, 0, 0, 0);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    if (
      newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() >= today.getMonth())
    ) {
      onMonthChange(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    if (newDate <= maxDate) {
      onMonthChange(newDate);
    }
  };

  const isSelectedDate = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isDisabledDate = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today || dateToCheck > maxDate;
  };

  const isPreviousMonthDisabled = () => {
    return (
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isNextMonthDisabled = () => {
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    return nextMonth > maxDate;
  };

  const hasIndicator = (day: number) => {
    return day === 9;
  };

  const handleDateSelect = (day: number) => {
    if (day && !isDisabledDate(day)) {
      const newSelectedDate = new Date(currentYear, currentMonth, day);
      onDateSelect(newSelectedDate);
    }
  };

  React.useEffect(() => {
    if (
      currentDate < today &&
      (currentDate.getMonth() !== today.getMonth() ||
        currentDate.getFullYear() !== today.getFullYear())
    ) {
      onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [currentDate, onMonthChange]);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="w-full h-full border-r border-gray-100 p-4">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousMonth}
          disabled={isPreviousMonthDisabled()}
          className={`p-1 ${isPreviousMonthDisabled() ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <span className="text-base font-medium">{monthYearString}</span>
        <button
          onClick={goToNextMonth}
          disabled={isNextMonthDisabled()}
          className={`p-1 ${isNextMonthDisabled() ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isDisabled = day && isDisabledDate(day);

          return (
            <div
              key={index}
              className="aspect-square flex flex-col items-center justify-center relative"
            >
              {day ? (
                <>
                  <button
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${isSelectedDate(day)
                        ? 'bg-green-100 border border-green-300 text-green-800'
                        : isToday(day)
                          ? 'bg-blue-100 border border-blue-300 text-blue-800'
                          : isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-800'
                      }`}
                  >
                    {day}
                  </button>
                  {hasIndicator(day) && !isDisabled && (
                    <div className="h-1 w-1 bg-green-500 rounded-full mt-1"></div>
                  )}
                </>
              ) : (
                <div className="w-10 h-10"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
