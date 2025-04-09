import React from 'react';
import {TimeSlotsProps} from '../../types/components/coach.types'


const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  timeSlots,
  selectedTimeSlotId,
  onTimeSlotSelect
}) => {
  // Format the selected date for display
  const selectedDateString = new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(selectedDate);

  // Get available slots count
  const availableSlotsCount = timeSlots.filter(slot => slot.isAvailable).length;

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium">{selectedDateString}</h2>
        <span className="text-sm text-gray-500">{availableSlotsCount} slots available</span>
      </div>
      
      {/* Time Slots */}
      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onTimeSlotSelect(slot)}
            disabled={!slot.isAvailable}
            className={`w-full py-4 px-4 bg-[#f6ffe5] rounded-md text-center transition-colors text-sm
              ${selectedTimeSlotId === slot.id
                ? ' border border-green-500 text-gray-800'
                : slot.isAvailable
                  ? ' hover:bg-green-100 text-gray-800'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
          >
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;