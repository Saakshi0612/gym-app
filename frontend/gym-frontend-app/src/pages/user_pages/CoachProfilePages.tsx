import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import CoachSidebar from '../../components/CoachComponents/CoachSideBar';
import AvatarImg from '../../assets/images/Avatar.jpg';
import CoachAvailabilityCalendar from '../../components/CoachComponents/CoachCalendar';
import FeedbackSection from '../../components/FeedBack/FeedBack';
import { BookedWorkout, BookedWorkoutsResponse, CoachFromApi, TimeSlot, UpcomingWorkout, UpcomingWorkoutsResponse } from '../../types/components/coach.types';
import LoginPromptModal from '../../components/homepage/isLoggedInCard';
import { ChevronRightIcon } from 'lucide-react';
import SystemAlert from '../../components/SystemAlert';
import axios from 'axios';
import ConfirmBook from '../../components/homepage/confirmBook';


const CoachProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<CoachFromApi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Track if user has actively selected a date
  const [dateSelected, setDateSelected] = useState<boolean>(true);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  // Get authentication state from Redux
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // State for available time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);

  // State for upcoming workouts
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<UpcomingWorkout[]>([]);
  const [upcomingWorkoutsLoading, setUpcomingWorkoutsLoading] = useState<boolean>(false);

  // Format date and time for display
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
  };

  // Generate all time slots from 8 AM to 8 PM
  const generateAllTimeSlots = (): TimeSlot[] => {
    return Array.from({ length: 12 }, (_, index) => {
      const startHour = 8 + index;
      const endHour = startHour + 1;

      // Format start time in 12-hour format
      const startHour12 = startHour > 12 ? startHour - 12 : startHour;
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const formattedStartTime = `${startHour12}:00 ${startPeriod}`;

      // Format end time in 12-hour format
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

  // Format date for API call (YYYY-MM-DD)
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fetch booked slots for the selected date
  const fetchBookedSlots = async (date: Date) => {
    if (!id) return;

    setSlotsLoading(true);

    try {
      const formattedDate = formatDateForApi(date);
      const response = await axios.get<BookedWorkoutsResponse>(
        `https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches/${id}/booked-workouts/${formattedDate}`
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

  // Fetch upcoming workouts for the coach
  const fetchUpcomingWorkouts = async (coachId: string) => {
    if (!coachId) return;

    setUpcomingWorkoutsLoading(true);

    try {
      const response = await axios.get<UpcomingWorkoutsResponse>(
        `https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches/${coachId}/workouts`
      );

      if (response.data.success) {
        setUpcomingWorkouts(response.data.workouts);
        console.log('Upcoming workouts:', response.data.workouts);
      } else {
        console.error("API returned error:", response.data);
        setUpcomingWorkouts([]);
      }
    } catch (err) {
      console.error("Error fetching upcoming workouts:", err);
      setUpcomingWorkouts([]);
    } finally {
      setUpcomingWorkoutsLoading(false);
    }
  };

  // Update available time slots based on booked slots
  const updateAvailableTimeSlots = (bookedWorkouts: BookedWorkout[]) => {
    // Start with all slots available
    const allTimeSlots = generateAllTimeSlots();

    // Mark booked slots as unavailable
    bookedWorkouts.forEach(booking => {
      if (booking.slotDetails) {
        const startTime = new Date(booking.slotDetails.startTime);
        const hour = startTime.getHours();

        // Find the slot that matches this hour and mark it as unavailable
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

  // Log authentication state for debugging
  useEffect(() => {
    console.log('Auth state in CoachProfilePage:', { isAuthenticated });
  }, [isAuthenticated]);

  // Initialize available time slots
  useEffect(() => {
    setAvailableTimeSlots(generateAllTimeSlots());
  }, []);

  // Fetch coach data and upcoming workouts
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch coach data');
        }

        const data: CoachFromApi = await response.json();
        console.log('Fetched coach data:', data);

        setCoach(data);

        // After fetching coach data, fetch booked slots for today
        fetchBookedSlots(selectedDate);

        // Also fetch upcoming workouts
        fetchUpcomingWorkouts(id as string);
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
    setDateSelected(true); // Mark that user has selected a date
    setSelectedTimeSlot(null); // Clear selected time slot when date changes
    fetchBookedSlots(date); // Fetch booked slots for the new date
    console.log(`Date changed to: ${date.toDateString()}`);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    console.log(`Selected time slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookWorkoutClick = () => {
    // Check if user has selected a date
    if (!dateSelected) {
      setAlertType('error');
      setAlertMessage("Please select a date for your workout.");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    // Check if user has selected a time slot
    if (!selectedTimeSlot) {
      setAlertType('error');
      setAlertMessage("Please select a time slot before booking.");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    // Check if user is authenticated
    if (isAuthenticated) {
      setShowConfirmCard(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleBookingConfirmed = () => {
    // Close the confirmation modal
    setShowConfirmCard(false);

    // Show success alert
    setAlertType('success');
    setAlertMessage(`Your workout with ${`${coach?.firstName} ${coach?.lastName}`} has been booked successfully!`);
    setShowAlert(true);

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    // Refresh the available time slots after booking
    fetchBookedSlots(selectedDate);

    // Refresh upcoming workouts after booking
    if (id) {
      fetchUpcomingWorkouts(id);
    }
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
        {/* Use grid for better responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coach Sidebar - Full width on small and medium screens, 1/4 on large */}
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

            {/* Upcoming Workouts Section */}
            <div>
              <h2 className="text-lg font-medium uppercase mb-4">Upcoming Workouts</h2>
              {upcomingWorkoutsLoading ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : upcomingWorkouts.length > 0 ? (
                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                  {upcomingWorkouts.map((workout) => (
                    <div
                      key={workout._id}
                      className="flex justify-between items-center border-l-4 border-blue-400 bg-blue-50 p-3 rounded-r-md mb-2"
                    >
                      <div>
                        <h3 className="font-medium">{workout.activity || workout.name}</h3>
                        <p className="text-sm text-gray-600">{formatDateTime(workout.date)}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        1 hour
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No upcoming workouts scheduled</p>
              )}
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
          // Store the current URL for redirect after login
          localStorage.setItem('redirectAfterLogin', `/coaches/${id}`);
          navigate("/login");
        }}
      />
    </div>
  );
};

export default CoachProfilePage;