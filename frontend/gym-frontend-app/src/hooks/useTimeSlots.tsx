// hooks/useTimeSlots.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeSlot, BookedWorkoutsResponse } from '../types/components/coach.types';

// Interface for API time slots
interface ApiTimeSlot {
  id: string;
  time_slot: string;
}

export const useTimeSlots = (coachId: string | undefined) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [apiTimeSlots, setApiTimeSlots] = useState<ApiTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateSelected, setDateSelected] = useState<boolean>(true);

  // Format date for API call (YYYY-MM-DD)
  const formatDateForApi = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch time slots from API
  const fetchApiTimeSlots = async () => {
    try {
      console.log("Fetching time slots from API...");
      const response = await axios.get(
        'https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/coaches/getAvailableTimeSlot'
      );
      
      if (response.data && response.data.time_slot) {
        setApiTimeSlots(response.data.time_slot);
        return response.data.time_slot;
      }
      return [];
    } catch (error) {
      console.error("Error fetching time slots from API:", error);
      return [];
    }
  };

  // Convert API time slots to our format
  const convertApiSlotsToTimeSlots = (apiSlots: ApiTimeSlot[]): TimeSlot[] => {
    if (!apiSlots || apiSlots.length === 0) {
      return [];
    }
    
    return apiSlots.map(slot => {
      const timeRange = slot.time_slot.split('-');
      const startTime = timeRange[0].trim();
      const endTime = timeRange[1]?.trim() || '';
      
      return {
        id: slot.id,
        startTime: startTime,
        endTime: endTime,
        isAvailable: true,
      };
    });
  };

  // Fetch booked slots for the selected date
  const fetchBookedSlots = async (date: Date, currentApiSlots = apiTimeSlots) => {
    if (!coachId) return;

    setSlotsLoading(true);

    try {
      // Make sure we have API time slots
      let slotsToUse = currentApiSlots;
      if (slotsToUse.length === 0) {
        slotsToUse = await fetchApiTimeSlots();
        setApiTimeSlots(slotsToUse);
      }
      
      const formattedDate = formatDateForApi(date);
      const response = await axios.get<BookedWorkoutsResponse>(
        `https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/coaches/${coachId}/available-slots/${formattedDate}`
      );

      if (response.data.success) {
        // Start with all slots available
        const allSlots = convertApiSlotsToTimeSlots(slotsToUse);
        
        // Mark booked slots as unavailable
        if (response.data.bookings && response.data.bookings.length > 0) {
          response.data.bookings.forEach(booking => {
            if (booking.slotDetails) {
              const startTime = new Date(booking.slotDetails.startTime);
              const hour = startTime.getHours();
              const minute = startTime.getMinutes();
              
              // Format the time to match our time slot format
              const period = hour >= 12 ? 'PM' : 'AM';
              const hour12 = hour % 12 || 12;
              const formattedTime = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
              
              // Find the matching slot and mark it unavailable
              const slotIndex = allSlots.findIndex(slot => 
                slot.startTime.includes(formattedTime) || 
                slot.startTime.includes(`${hour12}:00 ${period}`)
              );
              
              if (slotIndex !== -1) {
                allSlots[slotIndex].isAvailable = false;
              }
            }
          });
        }
        
        setAvailableTimeSlots(allSlots);
      } else {
        const allSlots = convertApiSlotsToTimeSlots(slotsToUse);
        setAvailableTimeSlots(allSlots);
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      const allSlots = convertApiSlotsToTimeSlots(currentApiSlots);
      setAvailableTimeSlots(allSlots);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Initialize time slots
  useEffect(() => {
    if (coachId) {
      const initializeTimeSlots = async () => {
        const apiSlots = await fetchApiTimeSlots();
        if (apiSlots.length > 0) {
          setApiTimeSlots(apiSlots);
          await fetchBookedSlots(selectedDate, apiSlots);
        }
      };
      
      initializeTimeSlots();
    }
  }, [coachId]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDateSelected(true);
    setSelectedTimeSlot(null);
    fetchBookedSlots(date);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return {
    availableTimeSlots,
    apiTimeSlots,
    slotsLoading,
    selectedTimeSlot,
    selectedDate,
    dateSelected,
    handleDateChange,
    handleTimeSlotSelect,
    fetchBookedSlots,
    setSelectedDate,
    setDateSelected,
  };
};