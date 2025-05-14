import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import CoachSidebar from '../../components/CoachComponents/CoachSideBar';
import AvatarImg from '../../assets/images/avatar-1.png';
import CoachAvailabilityCalendar from '../../components/CoachComponents/CoachCalendar';
import FeedbackSection from '../../components/FeedBack/FeedBack';
import { BookedWorkout, BookedWorkoutsResponse, CoachFromApi, TimeSlot } from '../../types/components/coach.types';
import LoginPromptModal from '../../components/homepage/isLoggedInCard';
import { ChevronRightIcon } from 'lucide-react';
import SystemAlert from '../../components/SystemAlert';
import axios from 'axios';
import ConfirmBook from '../../components/homepage/confirmBook';
import UpcomingWorkouts from '../../components/workouts/UpcomingWorkouts';

const CoachProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<CoachFromApi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateSelected, setDateSelected] = useState<boolean>(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [refreshWorkoutsKey, setRefreshWorkoutsKey] = useState<number>(0);

  // Format date for API call (YYYY-MM-DD)
  const formatDateForApi = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate all time slots from 8 AM to 8 PM
  const generateAllTimeSlots = (): TimeSlot[] => {
    return Array.from({ length: 12 }, (_, index) => {
      const startHour = 8 + index;
      const endHour = startHour + 1;
      const startHour12 = startHour > 12 ? startHour - 12 : startHour;
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const formattedStartTime = `${startHour12}:00 ${startPeriod}`;
      const endHour12 = endHour > 12 ? endHour - 12 : endHour;
      const endPeriod = endHour >= 12 ? 'PM' : 'AM';
      const formattedEndTime = `${endHour12}:00 ${endPeriod}`;

      return {
        id: `${startHour}`,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        isAvailable: true,
      };
    });
  };

  // Fetch booked slots for the selected date
  const fetchBookedSlots = async (date: Date) => {
    if (!id) return;

    setSlotsLoading(true);

    try {
      const formattedDate = formatDateForApi(date);
      const response = await axios.get<BookedWorkoutsResponse>(
        `https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/coaches/${id}/available-slots/${formattedDate}`
      );
      console.log(response.data.bookings);

      if (response.data.success) {
        updateAvailableTimeSlots(response.data.bookings);
      } else {
        console.error("API returned error:", response.data);
        setAvailableTimeSlots(generateAllTimeSlots());
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setAvailableTimeSlots(generateAllTimeSlots());
    } finally {
      setSlotsLoading(false);
    }
  };

  // Update available time slots based on booked slots
  const updateAvailableTimeSlots = (bookedWorkouts: BookedWorkout[]) => {
    const allTimeSlots = generateAllTimeSlots();

    bookedWorkouts.forEach(booking => {
      if (booking.slotDetails) {
        const startTime = new Date(booking.slotDetails.startTime);
        const hour = startTime.getHours();
        const slotIndex = allTimeSlots.findIndex(slot =>
          parseInt(slot.id) === hour
        );

        if (slotIndex !== -1) {
          allTimeSlots[slotIndex].isAvailable = false;
        }
      }
    });

    setAvailableTimeSlots(allTimeSlots);
  };

  // Initialize available time slots
  useEffect(() => {
    setAvailableTimeSlots(generateAllTimeSlots());
  }, []);

  // Fetch coach data
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/coaches/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch coach data');
        }

        const result = await response.json();
        console.log('API response:', result);

        if (result.success && result.data) {
          setCoach(result.data);
          fetchBookedSlots(selectedDate);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('Failed to load coach data');
        console.error('Error fetching coach data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoachData();
    }
  }, [id]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDateSelected(true);
    setSelectedTimeSlot(null);
    fetchBookedSlots(date);
    console.log(`Date changed to: ${date.toDateString()}`);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    console.log(`Selected time slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);
    setSelectedTimeSlot(timeSlot);
  };

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
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    if (isAuthenticated) {
      setShowConfirmCard(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleBookingConfirmed = () => {
    setShowConfirmCard(false);
    setAlertType('success');
    setAlertMessage(`Your workout with ${`${coach?.firstName} ${coach?.lastName}`} has been booked successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    
    // Refresh the available time slots after booking
    fetchBookedSlots(selectedDate);
    
    // Force the UpcomingWorkouts component to re-render and fetch new data
    setRefreshWorkoutsKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error || 'Coach not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Alert Component */}
      {showAlert && (
        <SystemAlert
          type={alertType}
          message={alertMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      <p className="flex items-center space-x-2 p-4">
        <span>Coaches</span>
        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        <span className="text-gray-600">{`${coach.firstName} ${coach.lastName}`}</span>
      </p>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coach Sidebar */}
          <div className="lg:col-span-1">
            <div className="max-w-sm mx-auto md:max-w-md lg:max-w-full">
              <CoachSidebar
                name_of_coach={`${coach.firstName} ${coach.lastName}`}
                rating={coach.rating}
                title={coach.title}
                about={coach.about}
                specializations={coach.specializations}
                certificates={coach.certificateUrls.map((url) => ({
                  name: url.split('/').pop() || 'Certificate',
                  file: url,
                }))}
                profileImage={coach.profileImageUrl || AvatarImg}
                onBookWorkout={handleBookWorkoutClick}
              />
            </div>
          </div>

          {/* Right Column - Calendar, Buttons, and Feedback */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar Section */}
            <div className="overflow-hidden">
              {slotsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <CoachAvailabilityCalendar
                  initialDate={selectedDate}
                  availableTimeSlots={availableTimeSlots}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  onDateChange={handleDateChange}
                />
              )}
            </div>

            {/* Upcoming Workouts Section - Using key to force re-render */}
            <div key={refreshWorkoutsKey}>
              <UpcomingWorkouts
                coachId={id as string}
                onWorkoutsLoaded={(workouts) => {
                  console.log('Workouts loaded in parent:', workouts.length);
                }}
              />
            </div>

            {/* Feedback Section */}
            <div>
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Card Modal */}
      {showConfirmCard && selectedTimeSlot && (
        <ConfirmBook
          coach={{
            ...coach,
            selectedTime: selectedTimeSlot.startTime,
            date: selectedDate.toISOString(),
          }}
          onClose={() => setShowConfirmCard(false)}
          onConfirm={handleBookingConfirmed}
        />
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onCancel={() => setShowLoginPrompt(false)}
        onLogin={() => {
          localStorage.setItem('redirectAfterLogin', `/coaches/${id}`);
          navigate("/login");
        }}
      />
    </div>
  );
};

export default CoachProfilePage;