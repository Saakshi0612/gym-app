import React, { useState } from 'react';
import Calendar from '../common/Calender';
import TimeSlots from './TimeSlots';
import { CoachAvailabilityCalendarProps, TimeSlot } from '../../types/components/coach.types';

const CoachAvailabilityCalendar: React.FC<CoachAvailabilityCalendarProps> = ({
  initialDate = new Date(),
  availableTimeSlots = [],
  onTimeSlotSelect,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (onDateChange) onDateChange(date);
  };

  // Handle month change
  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot.id);
    onTimeSlotSelect(timeSlot);
  };

  // Get available slots count
  // const availableSlotsCount = availableTimeSlots.filter(
  //   (slot) => slot.isAvailable
  // ).length;

  return (
    <div className="w-full overflow-hidden">
      {/* Header */}
      <div className="text-black p-2 uppercase tracking-wider text-sm font-medium">
        SCHEDULE
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Calendar Component */}
        <div className="w-full md:w-1/2">
          <Calendar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        </div>
        
        {/* Time Slots Component */}
        <div className="w-full md:w-1/2">
          <TimeSlots 
            selectedDate={selectedDate}
            timeSlots={availableTimeSlots}
            selectedTimeSlotId={selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachAvailabilityCalendar;