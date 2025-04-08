import React, { useState } from 'react';
import Calendar from './Calender';
import TimeSlots, { TimeSlot } from './TimeSlots';

interface CoachAvailabilityCalendarProps {
  initialDate?: Date;
  availableTimeSlots: TimeSlot[];
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onDateChange?: (date: Date) => void;
}

const CoachAvailabilityCalendar: React.FC<CoachAvailabilityCalendarProps> = ({
  initialDate = new Date(),
  // availableTimeSlots,
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

  // Example time slots for the selected date
  // In a real app, you would filter these based on the selected date
  const exampleTimeSlots = [
    { id: '1', startTime: '8:00', endTime: '9:00 AM', isAvailable: true },
    { id: '2', startTime: '9:00', endTime: '10:00 AM', isAvailable: true },
    { id: '3', startTime: '10:00', endTime: '11:00 AM', isAvailable: true },
    { id: '4', startTime: '3:00', endTime: '4:00 PM', isAvailable: true }
  ];

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
            timeSlots={exampleTimeSlots}
            selectedTimeSlotId={selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachAvailabilityCalendar;