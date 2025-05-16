// components/CoachComponents/CoachCalendarSection.tsx
import React from 'react';
import CoachAvailabilityCalendar from './CoachCalendar';
import { TimeSlot } from '../../types/components/coach.types';

interface CoachCalendarSectionProps {
  selectedDate: Date;
  availableTimeSlots: TimeSlot[];
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onDateChange: (date: Date) => void;
  slotsLoading: boolean;
}

const CoachCalendarSection: React.FC<CoachCalendarSectionProps> = ({
  selectedDate,
  availableTimeSlots,
  onTimeSlotSelect,
  onDateChange,
  slotsLoading
}) => {
  return (
    <div className="overflow-hidden">
      <CoachAvailabilityCalendar
        initialDate={selectedDate}
        availableTimeSlots={availableTimeSlots}
        onTimeSlotSelect={onTimeSlotSelect}
        onDateChange={onDateChange}
      />
      {slotsLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default CoachCalendarSection;