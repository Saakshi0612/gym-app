// hooks/useBookingWorkout.ts
import { useState } from 'react';
import { useAppSelector } from '../store/store';
import { TimeSlot, CoachFromApi } from '../types/components/coach.types';

interface ApiTimeSlot {
  id: string;
  time_slot: string;
}

// Define a type for the coach object used in booking
interface CoachForBooking {
  _id?: string;
  id?: string;
  Coaches?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    rating?: number;
    specializations?: string[];
    profileImageUrl?: string;
  };
  profileImageUrl?: string;
  selectedTime: {
    value: string;
    id: string;
    _id: string;
    label: string;
    time_slot: string;
    time: string;
  };
  selectedDate: Date;
  Available_Time_Slots: Array<{
    id: string;
    _id: string;
    time_slot: string;
    time: string;
    label: string;
  }>;
}

export const useBookingWorkout = (
  coach: CoachFromApi | null,
  apiTimeSlots: ApiTimeSlot[],
  selectedTimeSlot: TimeSlot | null,
  selectedDate: Date,
  dateSelected: boolean,
  fetchBookedSlots: (date: Date) => void
) => {
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [refreshWorkoutsKey, setRefreshWorkoutsKey] = useState<number>(0);
  const [selectedCoachForBooking, setSelectedCoachForBooking] = useState<CoachForBooking | null>(null);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleBookWorkoutClick = () => {
    if (!dateSelected) {
      setAlertType('error');
      setAlertMessage("Please select a date for your workout.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    if (!selectedTimeSlot) {
      setAlertType('error');
      setAlertMessage("Please select a time slot before booking.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    if (isAuthenticated) {
      // Find the matching API time slot with a more precise matching logic
      const apiTimeSlot = apiTimeSlots.find(slot => {
        // Split the time_slot string into start and end times
        const [slotStart, slotEnd] = slot.time_slot.split('-').map(t => t.trim());
        
        // Check if the start time matches exactly
        return slotStart === selectedTimeSlot.startTime && 
              (!slotEnd || slotEnd === selectedTimeSlot.endTime);
      });
      
      // Fallback to the original method if no exact match is found
      if (!apiTimeSlot) {
        const fallbackSlot = apiTimeSlots.find(slot => 
          slot.time_slot.startsWith(selectedTimeSlot.startTime)
        );
        
        if (fallbackSlot) {
          // Format the selected time slot to match what the ConfirmBookingCard expects
          const formattedTimeSlot = {
            value: fallbackSlot.id,
            id: fallbackSlot.id,
            _id: fallbackSlot.id,
            label: selectedTimeSlot.startTime,
            time_slot: fallbackSlot.time_slot,
            time: selectedTimeSlot.startTime
          };
          
          // Create a coach object that matches the structure expected by ConfirmBookingCard
          const coachForBooking: CoachForBooking = {
            _id: coach?._id,
            id: coach?._id,
            Coaches: {
              _id: coach?._id,
              id: coach?._id,
              firstName: coach?.firstName,
              lastName: coach?.lastName,
              title: coach?.title,
              rating: coach?.rating,
              specializations: coach?.specializations || [],
              profileImageUrl: coach?.profileImageUrl
            },
            profileImageUrl: coach?.profileImageUrl,
            selectedTime: formattedTimeSlot,
            selectedDate: selectedDate,
            Available_Time_Slots: apiTimeSlots.map(slot => ({
              id: slot.id,
              _id: slot.id,
              time_slot: slot.time_slot,
              time: slot.time_slot.split('-')[0].trim(),
              label: slot.time_slot.split('-')[0].trim()
            }))
          };
          
          setSelectedCoachForBooking(coachForBooking);
          setShowConfirmCard(true);
          return;
        }
      }
      
      if (!apiTimeSlot) {
        setAlertType('error');
        setAlertMessage("Could not find a valid time slot ID. Please try again.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        return;
      }
      
      // Format the selected time slot to match what the ConfirmBookingCard expects
      const formattedTimeSlot = {
        value: apiTimeSlot.id,
        id: apiTimeSlot.id,
        _id: apiTimeSlot.id,
        label: selectedTimeSlot.startTime,
        time_slot: apiTimeSlot.time_slot,
        time: selectedTimeSlot.startTime
      };
      
      // Create a coach object that matches the structure expected by ConfirmBookingCard
      const coachForBooking: CoachForBooking = {
        _id: coach?._id,
        id: coach?._id,
        Coaches: {
          _id: coach?._id,
          id: coach?._id,
          firstName: coach?.firstName,
          lastName: coach?.lastName,
          title: coach?.title,
          rating: coach?.rating,
          specializations: coach?.specializations || [],
          profileImageUrl: coach?.profileImageUrl
        },
        profileImageUrl: coach?.profileImageUrl,
        selectedTime: formattedTimeSlot,
        selectedDate: selectedDate,
        Available_Time_Slots: apiTimeSlots.map(slot => ({
          id: slot.id,
          _id: slot.id,
          time_slot: slot.time_slot,
          time: slot.time_slot.split('-')[0].trim(),
          label: slot.time_slot.split('-')[0].trim()
        }))
      };
      
      setSelectedCoachForBooking(coachForBooking);
      setShowConfirmCard(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleWorkoutBooked = () => {
    setShowConfirmCard(false);
    setSelectedCoachForBooking(null);
    
    // Show a brief success message
    setAlertType('success');
    setAlertMessage(`Your workout with ${coach?.firstName} ${coach?.lastName} has been booked successfully!`);
    setShowAlert(true);
    
    // Auto-dismiss the success message after 2 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    
    // Refresh the available time slots after booking
    fetchBookedSlots(selectedDate);
    
    // Force the UpcomingWorkouts component to re-render and fetch new data
    setRefreshWorkoutsKey(prev => prev + 1);
  };

  return {
    showConfirmCard,
    showLoginPrompt,
    showAlert,
    alertMessage,
    alertType,
    refreshWorkoutsKey,
    selectedCoachForBooking,
    handleBookWorkoutClick,
    handleWorkoutBooked,
    setShowConfirmCard,
    setShowLoginPrompt,
    setShowAlert,
    setSelectedCoachForBooking
  };
};